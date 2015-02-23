MOCHA=./node_modules/.bin/mocha

all: run

setup:
	npm install -d

run:
	gulp dev

test:
	$(MOCHA)

autotest:
	$(MOCHA) -w

lint:
	gulp lint

ci:
	@mkdir -p ./tmp
	@JUNIT_REPORT_PATH=tmp/test-report.xml JUNIT_REPORT_STACK=1 $(MOCHA) --reporter mocha-jenkins-reporter || true
	@gulp lint || true

.PHONY: run test autotest lint ci

