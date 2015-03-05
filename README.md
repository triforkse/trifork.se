# Trifork Stockholm's Website

[![Circle CI](https://circleci.com/gh/triforkse/trifork.se.svg?style=svg)](https://circleci.com/gh/triforkse/trifork.se)
[![David DM](https://img.shields.io/david/triforkse/trifork.se.svg)](https://david-dm.org/triforkse/trifork.se)

This is the source for the Swedish Trifork Website. You are welcome to copy or get inspired by it. We have a MIT license
on it see the LICENSE file.


## Developer Setup

1. Make sure you have [NodeJS](http://nodejs.org/) installed.
   Make sure you have [Gulp](http://gulpjs.com/) installed.
   Make sure you have [Pandoc](http://johnmacfarlane.net/pandoc/) installed.

2. Run these commands and you will be up and running:

   ```bash
   make setup
   make run
   ```

3. Some settings are done through environment variable to not include them in the source code.
   You should add the following to your `.bashrc`, `.zshrc` or `.profile` depending on your setup:

   ```bash
   export TF_MEETUP_API_KEY="[...]" # Where [...] is our API key from meetup.com
   export TF_RECAPTCHA_SECRET_KEY="[...]" # Where [...] is our recaptcha key from google.com
   export TF_MANDRILL_API_KEY_="[...]" # Where [...] is our mandrill API key.
   export TF_ENV="dev" # Use a developer setup, not production.
   ```

## The Handbook

Compilation of our handbook is handled a little specially. Since we cannot compile the handbook into
all the formats required on deployment we have to check all the formatted versions in as well.
To ensure the different version are never out of sync with the master file (e.i. `handbook.md`) a git
hook enforces that the handbook.{ext} must be newer than `handbook.md`.

During development a `gulp` task will ensure that they are always in sync. But if you change the
handbook while not running the server, you can explicitly update them using:

```bash
gulp handbook
```

## Contributing

This mostly applies to Trifork employees, but everyone is welcome to contribute.
Just send a pull-request here on GitHub -- that's it.


## Deployment

The `make setup` script will install a Heroku git-remote. When the project is pushed to it
the website is deployed. You will have to be granted _push-permission_ to the repo by our
heroku account. There is a nifty make target for deploying, just write:

```bash
make deploy
```
