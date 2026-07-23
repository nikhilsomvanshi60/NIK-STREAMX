.PHONY: all build test docker-up docker-down clean

all: test build

build:
	@echo "Building Go backend services..."
	cd services/api-gateway && go build -o bin/api-gateway main.go
	cd services/auth-service && go build -o bin/auth-service main.go
	cd services/source-resolver && go build -o bin/source-resolver main.go
	cd services/media-service && go build -o bin/media-service main.go

test:
	@echo "Running tests across Go services..."
	cd services/source-resolver && go test -v ./...
	cd services/auth-service && go test -v ./...
	cd services/api-gateway && go test -v ./...

docker-up:
	docker compose -f infra/docker/docker-compose.yml up --build -d

docker-down:
	docker compose -f infra/docker/docker-compose.yml down -v

clean:
	rm -rf services/*/bin
