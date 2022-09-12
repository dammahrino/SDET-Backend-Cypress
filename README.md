# SDET-test
## Challenge
Create pilot Java test framework for testing NASA's open API

NASA has an open API: https://api.nasa.gov/index.html#getting-started. It grants access to different features e.g: Astronomy Picture of the Day, Mars Rover Photos, etc.

We would like to test different scenarios that the API offers:
1. Retrieve the first 10 Mars photos made by "Curiosity" on 1000 Martian sol.
2. Retrieve the first 10 Mars photos made by "Curiosity" on Earth date equal to 1000 Martian sol.
3. Retrieve and compare the first 10 Mars photos made by "Curiosity" on 1000 sol and on Earth date equal to 1000 Martian sol.
4. Validate that the amounts of pictures that each "Curiosity" camera took on 1000 Mars sol is not greater than 10 times the amount taken by other cameras on the same date.
5. Write integration tests around the core functionality, not functional tests.

## Instructions
You will need to fork the repository and build the solution in Github **publicly**. Once you are finished, let HR know and share a link to your fork or a Zip file with your solution and the URL of the repository.

Please use TestNG, Postman, or Junit to complete the challenge.  For this challenge, do not use Cucumber.

# Execution
In this solution, we use Cypress as our main tool for API Testing of the NASA's Mars Rover API.

## Steps to execute
1. Clone the repository into your machine
2. Install [Node JS](https://nodejs.org/en/). Tested with `node version 16.17.0`.
3. Install the project dependencies using `npm install` command in the root folder of the project. The project uses `Cypress@10.7.0`.
4. Request your NASA API Key [here](https://api.nasa.gov/)
5. In the command line, execute the Tests with an Electron based browser with `npx cypress run --browser electron --env API_KEY=<INSERT_YOUR_NASA_API_KEY>`.

Side Note: To open the Cypress UI, run the following command: `npm run cypress:open`.

