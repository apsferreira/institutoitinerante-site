# Deploy Guide — institutoitinerante.com.br

Guia completo de go-live para produção e staging no K3s cluster IIT.

---

## Ambientes

| Ambiente | URL | Branch | Namespace | Imagem |
|----------|-----|--------|-----------|--------|
| Produção | https://institutoitinerante.com.br | `main` | `iit-website` | `:sha-<hash>` + `:latest` |
| Staging | https://stg.institutoitinerante.com.br | `develop` | `iit-website-staging` | `:sha-<hash>` + `:develop` |

---

## 1. DNS no Cloudflare

**Antonio configura diretamente no painel do Cloudflare.**

### Obter o IP do Ingress Controller
```bash
kubectl get svc -n ingress-nginx ingress-nginx-controller   -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

> Em homelab sem LoadBalancer externo (sem MetalLB), o IP é o do nó master do K3s.  
> Verificar: `kubectl get nodes -o wide` e usar o EXTERNAL-IP ou INTERNAL-IP do nó que expõe o ingress.

### Registros A a criar no Cloudflare

| Tipo | Nome | Conteúdo | Proxy | TTL |
|------|------|----------|-------|-----|
| A | `institutoitinerante.com.br` | `<IP do ingress>` | DNS only (cinza) | Auto |
| A | `www.institutoitinerante.com.br` | `<IP do ingress>` | DNS only (cinza) | Auto |
| A | `stg.institutoitinerante.com.br` | `<IP do ingress>` | DNS only (cinza) | Auto |

**Por que "DNS only" (proxy desligado)?**
O cert-manager usa HTTP-01 challenge do Let's Encrypt para emitir TLS.  
Com o proxy do Cloudflare ativado (laranja), o challenge pode falhar porque o Cloudflare intercepta o tráfego antes de chegar ao cluster.  
Após os certificados serem emitidos com sucesso, você pode ativar o proxy (laranja) para ter WAF e CDN do Cloudflare — mas teste antes de ativar em produção.

**Staging nunca deve ter proxy ativado** (simplifica o debug e o cert é de staging de qualquer forma).

---

## 2. Pré-requisitos no Cluster

### 2.1 Ingress Controller (nginx-ingress)
```bash
# Verificar se está instalado
kubectl get pods -n ingress-nginx

# Se não estiver (K3s usa Traefik por padrão — instalar nginx-ingress):
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx   --namespace ingress-nginx   --create-namespace   --set controller.service.type=LoadBalancer

# Aguardar IP ser atribuído
kubectl get svc -n ingress-nginx ingress-nginx-controller -w
```

> Alternativa: se preferir manter o Traefik nativo do K3s, ajustar `spec.ingressClassName` de `nginx` para `traefik` em todos os ingress.yaml e remover as anotações `nginx.ingress.kubernetes.io/*`.

### 2.2 cert-manager
```bash
kubectl get pods -n cert-manager

# Se não estiver instalado:
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install cert-manager jetstack/cert-manager   --namespace cert-manager   --create-namespace   --set installCRDs=true

# Aguardar pods ficarem Ready
kubectl get pods -n cert-manager -w
```

### 2.3 ClusterIssuers (Let's Encrypt)
```bash
# Criar ambos os issuers (staging e produção) de uma vez
kubectl apply -f k8s/cluster-issuers.yaml

# Verificar
kubectl get clusterissuers
```

Arquivo `k8s/cluster-issuers.yaml` já contém:
- `letsencrypt-staging` — sem rate limit, cert não trusted (para testes)
- `letsencrypt-prod` — rate limit 5 certs/semana, cert trusted pelos browsers

---

## 3. Secrets e Credenciais

### GitHub Secrets
Configurar em: **GitHub repo → Settings → Secrets and variables → Actions**

| Secret | Descrição |
|--------|-----------|
| `GHCR_TOKEN` | Personal Access Token com permissão `write:packages` |

**Criar o token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Permissões necessárias: `write:packages`, `read:packages`
3. Copiar e adicionar como secret `GHCR_TOKEN`

### GitHub Environments (opcional mas recomendado)
Configure dois environments no GitHub para adicionar aprovação manual em produção:
- **staging** — sem aprovação, deploy automático
- **production** — com revisores obrigatórios antes do deploy

Configurar em: **GitHub repo → Settings → Environments**

---

## 4. ArgoCD — Cadastrar as Aplicações

### App de Produção
```bash
argocd app create iit-website-prod   --repo https://github.com/apsferreira/institutoitinerante-site   --path k8s   --dest-server https://kubernetes.default.svc   --dest-namespace iit-website   --sync-policy automated   --auto-prune   --self-heal   --revision main
```

### App de Staging
```bash
argocd app create iit-website-staging   --repo https://github.com/apsferreira/institutoitinerante-site   --path k8s/staging   --dest-server https://kubernetes.default.svc   --dest-namespace iit-website-staging   --sync-policy automated   --auto-prune   --self-heal   --revision develop
```

> Cada app monitora sua branch (`main` para prod, `develop` para staging) e sincroniza quando o CI/CD commita a nova tag de imagem.

---

## 5. Primeiro Deploy

### Staging primeiro (sempre)
```bash
# Aplicar manifests de staging
kubectl apply -k k8s/staging/

# Verificar pods
kubectl get pods -n iit-website-staging -w

# Verificar certificado TLS (staging — pode demorar 1-2 min)
kubectl get certificate -n iit-website-staging -w

# Testar (o browser vai mostrar aviso de cert não trusted — normal com letsencrypt-staging)
curl -k https://stg.institutoitinerante.com.br/healthz
```

### Produção
```bash
kubectl apply -k k8s/

kubectl get pods -n iit-website -w
kubectl get certificate -n iit-website -w

# Testar (cert trusted)
curl https://institutoitinerante.com.br/healthz
```

---

## 6. Fluxo GitOps — Como funciona no dia a dia

```
Desenvolve em feature branch
        ↓
Pull Request → develop
        ↓
CI/CD: build + docker push :sha-<hash> + :develop
        ↓
GitOps commit: atualiza k8s/staging/deployment.yaml
        ↓
ArgoCD detecta mudança → deploy em iit-website-staging
        ↓
QA valida em https://stg.institutoitinerante.com.br
        ↓
Pull Request: develop → main
        ↓
CI/CD: build + docker push :sha-<hash> + :latest
        ↓
GitOps commit: atualiza k8s/deployment.yaml
        ↓
ArgoCD detecta mudança → deploy em iit-website
        ↓
Site no ar em https://institutoitinerante.com.br
```

---

## 7. Validação Pós-Deploy

### Checklist staging
```bash
kubectl get pods -n iit-website-staging
curl -k https://stg.institutoitinerante.com.br/healthz
curl -kI https://stg.institutoitinerante.com.br | grep -E "(X-Environment|X-Robots-Tag)"
# X-Environment: staging
# X-Robots-Tag: noindex, nofollow
```

### Checklist produção
```bash
kubectl get pods -n iit-website
curl https://institutoitinerante.com.br/healthz
curl -I https://www.institutoitinerante.com.br
# Deve redirecionar 301 para https://institutoitinerante.com.br

# Verificar headers de segurança
curl -I https://institutoitinerante.com.br | grep -E "(Strict-Transport|X-Frame|X-Content|Content-Security)"

# SEO
curl https://institutoitinerante.com.br/sitemap.xml
curl https://institutoitinerante.com.br/robots.txt
```

### Lighthouse (performance)
- URL: https://pagespeed.web.dev/
- Testar: `https://institutoitinerante.com.br`
- Meta: Performance >= 90, SEO >= 95, Accessibility >= 90, Best Practices >= 90

---

## 8. Rollback

```bash
# Produção
kubectl rollout undo deployment/iit-website -n iit-website
kubectl rollout history deployment/iit-website -n iit-website

# Staging
kubectl rollout undo deployment/iit-website -n iit-website-staging
```

Ou via GitOps: reverter o commit que atualizou a tag da imagem — ArgoCD vai reconciliar.

---

## Checklist Final

### Cloudflare DNS (Antonio configura)
- [ ] A record: `institutoitinerante.com.br` → IP do ingress (DNS only)
- [ ] A record: `www.institutoitinerante.com.br` → IP do ingress (DNS only)
- [ ] A record: `stg.institutoitinerante.com.br` → IP do ingress (DNS only)

### Cluster
- [ ] Ingress controller (nginx-ingress) instalado
- [ ] cert-manager instalado
- [ ] ClusterIssuers criados: `kubectl apply -f k8s/cluster-issuers.yaml`

### GitHub
- [ ] Secret `GHCR_TOKEN` configurado
- [ ] Environments `staging` e `production` criados (opcional: aprovação em prod)

### Deploy
- [ ] `kubectl apply -k k8s/staging/` — staging funcionando
- [ ] `kubectl apply -k k8s/` — produção funcionando
- [ ] Certificados TLS emitidos (staging: letsencrypt-staging, prod: letsencrypt-prod)
- [ ] ArgoCD apps cadastradas: `iit-website-prod` e `iit-website-staging`

### Validação
- [ ] stg.institutoitinerante.com.br acessível (aviso de cert esperado)
- [ ] institutoitinerante.com.br acessível com cert confiável
- [ ] www redirect funcionando (301 → non-www)
- [ ] /healthz respondendo em ambos os ambientes
- [ ] sitemap.xml e robots.txt acessíveis em produção
- [ ] Header X-Robots-Tag: noindex presente em staging
- [ ] Lighthouse >= 90 em produção
