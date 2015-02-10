test:
	npm test

test-harmony:
	node --harmony --harmony_generators --use_strict node_modules/mocha/bin/mocha

# 1. npm install -g node-inspector
# 2. run node-inspector in another console
debug:
	mocha --debug --debug-brk --ui tdd --reporter dot 'test/**/*-test.js'

build:
	browserify src/kraken.js --standalone Kraken > dist/kraken.js

.PHONY: test
