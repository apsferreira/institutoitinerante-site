# ─────────────────────────────────────────────
# IIT Website — Makefile
# ─────────────────────────────────────────────

IMAGE_NAME  := ghcr.io/apsferreira/iit-website
IMAGE_TAG   := local
CONTAINER   := iit-website-local
PORT        := 3000

.PHONY: build docker-build docker-run docker-stop deploy clean help

## build: Install dependencies and build Astro site
build:
	@echo "📦 Installing dependencies..."
	npm ci
	@echo "🔨 Building Astro..."
	npm run build
	@echo "✅ Build complete — output in dist/"

## docker-build: Build Docker image locally
docker-build:
	@echo "🐳 Building Docker image $(IMAGE_NAME):$(IMAGE_TAG)..."
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .
	@echo "✅ Docker image built: $(IMAGE_NAME):$(IMAGE_TAG)"

## docker-run: Run the site locally on port $(PORT)
docker-run: docker-build
	@echo "🚀 Starting container on http://localhost:$(PORT) ..."
	docker rm -f $(CONTAINER) 2>/dev/null || true
	docker run -d \
		--name $(CONTAINER) \
		-p $(PORT):80 \
		$(IMAGE_NAME):$(IMAGE_TAG)
	@echo "✅ Site running at http://localhost:$(PORT)"

## docker-stop: Stop local container
docker-stop:
	@docker rm -f $(CONTAINER) 2>/dev/null || true
	@echo "🛑 Container stopped."

## deploy: Apply all Kubernetes manifests via Kustomize
deploy:
	@echo "🚀 Deploying to K3s cluster..."
	kubectl apply -k k8s/
	@echo "✅ Manifests applied. Checking rollout..."
	kubectl rollout status deployment/iit-website -n iit-website

## clean: Remove local build artifacts
clean:
	@echo "🧹 Cleaning..."
	rm -rf dist/ node_modules/
	docker rm -f $(CONTAINER) 2>/dev/null || true
	docker rmi $(IMAGE_NAME):$(IMAGE_TAG) 2>/dev/null || true
	@echo "✅ Clean done."

## help: Show available commands
help:
	@grep -E '^## ' Makefile | sed 's/## //' | column -t -s ':'
