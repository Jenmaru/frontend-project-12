lint-frontend:
	make -C frontend lint

install:
	npm ci

start:
	npx start-server -s ./frontend/build
	
build:
	npm run build
