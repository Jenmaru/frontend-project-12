lint-frontend:
	make -C frontend lint

install:
	npm ci ./frontend/build

start-frontend:
	make -C frontend start

start-backend:
	npx start-server

start:
	npx start-server -s ./frontend/build
	
build: 
	make -C frontend build
