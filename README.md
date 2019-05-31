# Never Forget Server

Backend Server / API for Never Forget, a spaced repetition learning app. The server uses MongoDB as its data source, with GraphQL as the API query language. Apollo and Express handle the requests / responses. 

The goal is for this to be used as a backend to a full stack spaced repetition learning app. In the meantime, a fully implemented CLI version is available to experiment with here: [Never Forget CLI](https://github.com/tmns/never-forget-cli).

## Features
So far, all of the main functionality has been implemented. You can:

* User
  * Create a User (signup)
  * Update a User (change username or password)
  * Remove a User (delete account)
  * Authenticate a User (login)
  * Deauthenticate a User (logout)
  * Appropriate authN & AuthZ checks on the above

* Deck
  * Get Deck(s)
  * Create a Deck
  * Update a Deck
  * Remove a Deck
  * Appropriate authN & AuthZ checks

* Card
  * Get Card(s)
  * Create a Card
  * Update a Card
  * Remove a Card
  * Appropriate authN & AuthZ checks

*Study and Export / Import functionality will be implemented client side*

## Build 
To build, `cd` to project root and run:
```
$ npm install && npm run build
```
This should install dependencies and then output a transpiled version of app.js to `src/dist`. From there you can run the app directly like so `node dist/index.js`, which will launch the GraphQL server.

To configure the database url and server url / port, you can edit the values defined in `src/config/config.js`.

## Usage
Run `node dist/index.js`, check out the GraphQL Playground's schema / docs, and then start playing around! The only *gotchas* to watch out for is that every deck requires a unique name (for a given user) and every card requires a unique prompt (for a given user) and a target.

## License
The source of this app may be used under the WTFPL - or, if you take issue with that, consider it to be under the CC0.

## Contributing
Feedback and contributions are welcome. Feel free to create issues, fork, submit pull requests, etc. However, if you make any changes to the application logic, make sure to run the full test suite before opening a PR. 

To run tests, simply execute the following in the project root:
```
$ npm test
```

**PR's that do *not* include output from the above command will be rejected automatically!**

Finally, if you want to contribute in a different way, you can always buy me a coffee ^_^

[![Buy me a coffee](https://www.buymeacoffee.com/assets/img/custom_images/purple_img.png)](https://www.buymeacoffee.com/tmns)