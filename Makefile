lint-frontend:
	make -C frontend lint

install:
	npm ci

start-frontend:
	make -C frontend start

start-backend:
	npx start-server

start-production
	npx start-server -s ./frontend/build

build-production:
	make -C frontend start
	
build:
	make start-frontend & make start-backend
