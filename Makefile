MOCHA=./node_modules/.bin/mocha

all: run

setup:
	@echo "\nGit Hooks Installed\n"
	-ln -s -f ../../etc/git-hooks/pre-commit .git/hooks/pre-commit
	@echo "\nInstalling Git Remote for Deployment.\n"
	-git remote add heroku git@heroku.com:triforkse.git
	@echo "\nInstalling automatic dependencies.\n"
	npm install
	./node_modules/.bin/bower install
	@echo "\nDone! Check the README.md for dependencies that must be manually installed.\n"

run:
	./node_modules/.bin/gulp dev

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

deploy:
	git push heroku HEAD

.PHONY: run test autotest lint ci
