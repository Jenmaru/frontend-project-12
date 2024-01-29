lint-frontend:
	make -C frontend lint

install:
	npm ci

start:
	npx start-server -s ./frontend/build & make -C frontend start
	
build:
	npm run build
