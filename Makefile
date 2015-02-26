MOCHA=./node_modules/.bin/mocha

all: run

setup:
	@echo "\nGit Hooks Installed\n"
	-ln -s -f etc/git-hooks/pre-commit .git/hooks/pre-commit
	@echo "\nInstalling automatic installed dependencies.\n"
	npm install -d
	@echo "\nDone! Check the README.md for dependencies that must be manually installed.\n"

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

