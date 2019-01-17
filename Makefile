.PHONY: test 

all: test 

deps: node_modules

node_modules:
	npm install

compile: deps
	npm run lint

test: compile
	npm run test
	
clean:
	rm -rf node_modules
	rm -f package-lock.json
	rm -f test/report.xml
	rm -rf ./coverage/
