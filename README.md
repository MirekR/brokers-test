# README #

### What is this repository for? ###
Brokers insight coding test


### How do I get set up? ###
Install Node: https://nodejs.org/en/download 

* Clone repo
* run `cp .env.example .env`
* run `npm install`
* run `npm run dev`
* Use swagger link: `http://localhost:5001/docs/#/`

- To see any data on the insight root, you need to first execute the ingest controllers

### Run tests
* run `npm run test`

### Run integration tests
* run `npm run it`

### Run all tests
* run `npm run test-all`

### Test discussion
As we spoke about the test coverage in the initial interview, you can see tests are split between unit and integration tests and you can see, none of the coverting is 100% but all together cover most
of the important code that needs testing. Like for example the unit tests for parsing or integration test to ensure "queries" to the database are correct and return expected results. 
On an actual project, there would be bit more coverage and focus on test but as you said during the interview, "Don't spend too much time on this" so hopefully this gives you enough idea of the 
testing approach but happy to discuss more in depth next time.

### Other discussion
•Ingest controllers•
Don't know how exactly data are actually received, making assumption they would be pushed to the platform via webhooks accepting CSV hence each broker has their own ingest controller.
This also helps to keep them separated and have fine grained control who's pushing what data.
There could other mechanism like time based ingest from FTP server controlled by crone (or like aws eventBridge) or other types of webhooks. Over time there might be more clear commonalities 
that could help build more unified entry point to the platform. 