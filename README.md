
# Instituto Itinerante - Site Institucional

Este é o repositório do site institucional do Instituto Itinerante, acessível em [institutoitinerante.com.br](https://institutoitinerante.com.br). O site apresenta os produtos, soluções e a missão do instituto.

## 1. Descrição do Projeto

O site serve como a principal vitrine digital do Instituto Itinerante, uma edtech B2B que oferece soluções de aprendizagem corporativa. O objetivo é apresentar de forma clara e atraente os produtos e serviços da empresa para potenciais clientes (empresas e RHs), parceiros e para a comunidade de educação e tecnologia.

## 2. Stack Tecnológico

| Ferramenta | Versão | Propósito |
|---|---|---|
| **Astro** | `^4.16.0` | Framework principal para construção do site (Static Site Generation). |
| **React** | `^18.3.1` | Usado para componentes interativos. |
| **Tailwind CSS** | `^3.4.14` | Framework de CSS para estilização. |
| **Node.js** | `v20` | Ambiente de execução para build. |
| **Docker** | - | Containerização da aplicação para deploy. |
| **Nginx** | `alpine` | Servidor web para servir os arquivos estáticos. |
| **Kubernetes (K3s)**| - | Orquestração de containers em produção. |
| **ArgoCD** | - | Ferramenta de GitOps para deploy contínuo. |
| **GitHub Actions**| - | Automação de CI/CD. |

- **Configuração Astro (`astro.config.mjs`):** Utiliza as integrações oficiais para React e Tailwind CSS.
- **Configuração TypeScript (`tsconfig.json`):** Configuração padrão do Astro (`strict`).

## 3. Arquitetura de Pastas

A estrutura do projeto é baseada nas convenções do Astro:

```
.
├── .github/workflows/      # CI/CD (GitHub Actions)
├── dist/                   # Output do build (não versionado)
├── docs/                   # Documentação adicional
├── k8s/                    # Manifestos Kubernetes (produção e staging)
├── public/                 # Arquivos estáticos (imagens, fontes, etc.)
├── src/
│   ├── components/         # Componentes reutilizáveis (Astro & React)
│   ├── content/            # Coleções de conteúdo (Markdown, etc.)
│   ├── i18n/               # Configuração de internacionalização
│   ├── layouts/            # Templates de página
│   ├── pages/              # Estrutura de rotas e páginas do site
│   └── styles/             # Estilos globais
├── astro.config.mjs        # Configuração do Astro
├── Dockerfile              # Definição do container da aplicação
├── nginx.conf              # Configuração do Nginx
├── package.json            # Dependências e scripts
└── tailwind.config.mjs     # Configuração do Tailwind CSS
```

## 4. Funcionalidades Principais

- **Páginas de Produtos:** Seções detalhadas para cada produto (`BRIO`, `Focus Hub`, `My Library`).
- **Páginas de Soluções:** Apresentação das soluções para diferentes públicos (`Empresas`, `Consultorias`).
- **Internacionalização (i18n):** O site possui estrutura para múltiplos idiomas (Português e Inglês).
- **Formulário de Contato:** Componente interativo em React para captura de leads.
- **Blog:** Seção de conteúdo e artigos.

## 5. Páginas & Rotas

- `/`: Página inicial
- `/brio`: Página do produto BRIO
- `/focus-hub`: Página do produto Focus Hub
- `/my-library`: Página do produto My Library
- `/solucoes`: Apresentação das soluções
- `/para/empresas`: Soluções para empresas
- `/para/consultorias`: Soluções para consultorias
- `/parceiros`: Página para parceiros
- `/contato`: Página com formulário de contato
- `/blog`: Listagem de artigos
- `/en/...`: Versões em inglês das páginas acima

## 6. Componentes Key

- `BaseLayout.astro`: Layout principal que envolve todas as páginas.
- `Nav.astro`: Componente de navegação principal.
- `Footer.astro`: Rodapé do site.
- `ContactForm.tsx`: Formulário de contato feito em React.
- `LanguageSwitcher.astro`: Componente para alternar entre idiomas.
- `Hero.astro`: Seção de destaque principal da home page.
- `SocialProofBar.astro`: Barra com logos de clientes/parceiros.

## 7. Variáveis de Ambiente

| Variável | Descrição | Default |
|---|---|---|
| `PUBLIC_CATALOG_API_URL` | URL base da API de catálogo (produtos e preços). Usada nas páginas de pricing para buscar dados dinâmicos. | `https://catalog-api.institutoitinerante.com.br` |

Copie `.env.example` para `.env` e ajuste conforme necessário. Para desenvolvimento local com a API rodando localmente, use `http://localhost:8080`.

## 8. Como Rodar Localmente

**Pré-requisitos:**
- Node.js (versão 20 ou superior)
- npm (ou pnpm/yarn)

**Passos:**

1.  **Clone o repositório:**
    ```bash
    git clone <url-do-repositorio>
    cd institutoitinerante-site
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    O site estará disponível em `http://localhost:4321`.

## 9. Build & Deployment

O processo de build e deploy é idêntico ao do projeto `antoniopedro-site`, sendo totalmente automatizado via GitHub Actions, Docker, Kubernetes e ArgoCD.

### Build

Para gerar a versão estática do site para produção:
```bash
npm run build
```
Os arquivos são gerados no diretório `dist/`.

### Deployment

O fluxo de GitOps é o seguinte:

1.  **Push:** Um push nas branches `main` ou `develop` inicia a pipeline no GitHub Actions.
2.  **Build:** A action faz o build do Astro.
3.  **Docker Image:** Uma imagem Docker é criada com os arquivos estáticos e o Nginx.
4.  **Push to GHCR:** A imagem é enviada para o GitHub Container Registry (`ghcr.io`).
5.  **Update Manifest:** A action atualiza o manifesto Kubernetes do ambiente correspondente com a nova tag da imagem.
6.  **ArgoCD Sync:** O ArgoCD detecta a alteração no repositório e sincroniza o cluster, realizando o deploy da nova versão.

## 10. Contribuindo

- **Branches:**
    - `main`: Ambiente de produção.
    - `develop`: Ambiente de staging.
- **Git Workflow:**
    1. Crie uma nova branch a partir da `develop`.
    2. Desenvolva a feature ou correção.
    3. Abra um Pull Request para a `develop`.
    4. Após o merge para `develop`, o deploy para o ambiente de staging é automático.
    5. Para produção, abra um Pull Request da `develop` para a `main`.
- **CI/CD:** A pipeline no GitHub Actions gerencia todo o ciclo.

## 11. Status Atual

- **Versão:** 1.0.0
- **Status:** Em produção, estável.
- **Issues Conhecidas:** Nenhuma issue crítica no momento.

## 12. Roadmap

- [ ] Expandir o conteúdo do blog.
- [ ] Adicionar mais casos de sucesso de clientes.
- [ ] Otimizar o Lighthouse score para performance e SEO.
- [ ] Traduzir todas as páginas e posts para inglês.
