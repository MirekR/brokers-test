# README #

### What is this repository for? ###
Brokers insight coding test

 - Basic nodejs service
 - In memory "database" for storing and retrieving data
 - Auto generated swagger based on to controllers for easy endpoint discovery (one of my most favorite tools, simple and helps keep track of endpoints and their expected in and outs)

### How do I get set up? ###
Install Node: https://nodejs.org/en/download 

* Clone repo
* run `cp .env.example .env`
* run `npm i`
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
As we spoke about the test coverage in the initial interview, you can see tests are split between unit and integration tests and you can see, none of them covering 100% but all together cover most
of the important code that needs testing. Like for example the unit tests for parsing or integration test to ensure "queries" to the database are correct and return expected results. 
On an actual project, there would be bit more coverage and focus on test but as you said during the interview, "Don't spend too much time on this" so hopefully this gives you enough idea of the 
testing approach but happy to discuss more in depth next time.

Test all coverage result from nyc (runs as part of the tests) and displays at the end.
--------------------------|---------|----------|---------|---------|-------------------
File                      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------------------|---------|----------|---------|---------|-------------------
All files                 |      75 |       60 |   66.66 |   75.55 |                   
 controllers              |   68.42 |        0 |    37.5 |   70.58 |                   
  broker-one-ingest.ts    |   61.53 |        0 |      25 |   65.21 | 19-33             
  insights.ts             |   83.33 |      100 |      50 |   81.81 | 15,20             
 repo                     |      92 |    61.76 |    87.5 |    91.3 |                   
  failed-data-repo.ts     |      75 |      100 |      50 |      75 | 23                
  normalised-data-repo.ts |   95.23 |    61.76 |   92.85 |   94.73 | 64                
 utils                    |   69.69 |    64.28 |      50 |   69.69 |                   
  consts.ts               |     100 |      100 |     100 |     100 |                   
  csv-reader.ts           |      40 |      100 |       0 |      40 | 6-16              
  parse-utils.ts          |   80.95 |    64.28 |     100 |   80.95 | 36-40,44          
--------------------------|---------|----------|---------|---------|-------------------


### Other discussion
•Ingest controllers•
Don't know how exactly data are actually received, making assumption they would be pushed to the platform via webhooks accepting CSV hence each broker has their own ingest controller.
This also helps to keep them separated and have fine grained control who's pushing what data.
There could other mechanism like time based ingest from FTP server controlled by crone (or like aws eventBridge) or other types of webhooks. Over time there might be more clear commonalities 
that could help build more unified entry point to the platform. 

•Database•
... or lack of it. For the exercise purposes I opted out DB setup and just wrote simple object "queries". You can see in the code that each repo class has repo object returning it's instance so would be easy to swap DB implementation - instance also could be Injected using some additional frameworks if required / needed.  
Database could be supplied as docker image (for example Mongo: https://hub.docker.com/_/mongo) but it would require more bit more setup and not sure if that would be beneficial for this exercise - but if you would feel that's needed, I could add it before next interview step. 
