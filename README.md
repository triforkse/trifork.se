# Trifork Stockholm's Website

[![Circle CI](https://circleci.com/gh/triforkse/trifork.se.svg?style=svg)](https://circleci.com/gh/triforkse/trifork.se)
[![David DM](https://img.shields.io/david/triforkse/trifork.se.svg)](https://david-dm.org/triforkse/trifork.se)

This is the source for the Swedish Trifork Website. You are welcome to copy or get inspired by it. We have a MIT license
on it see the LICENSE file.

## Developer Setup

1. Make sure you have [NodeJS](http://nodejs.org/) installed.
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
   ```

## Contributing

This mostly applies to Trifork employees, but everyone is welcome to contribute.
Just send a pull-request here on GitHub -- that's it.
