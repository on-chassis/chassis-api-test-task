## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ docker-compose up
```

## Description
Your task is to implement API for polling mechanism which will allow users to create their own polls so others can take these surveys and answer some questions.
Polls have sections, so we can split up a long poll into several pages (one page - one section). At least one section per poll for consistency.
Sections have questions. At least one question in section.

Every user should have a default poll to start from (which should be available for sending it to respondents right away).

If User A changes the default poll it should remain unchanged for others.

Users should have an ability to mark a poll as `nonPublic` so only registered users will have an access to that poll. Otherwise - it's open for everyone.

## Required functionality:
* Sign up / Sign in via email + password.
* Create / Update / Delete a poll (protected)
* Create / Update / Delete a section within poll (protected)
* Create / Update / Delete a question within section (protected)
* Retrieve a single poll by id. Keep in mind `nonPublic` flag, so non-public polls won't be available for unregistered users.  
* Retrieve all polls for a particular user. Keep in mind `nonPublic` flag, so non-public polls won't be available for unregistered users.

### Default poll (always public)
* Company info (section)
  * What's your company name?
  * How many people in a company?
* Personal info (section)
  * What is your name?
  * How old are you?

### Important details
* Questions have freeform answers
* Poll has `description` field that can be updated
* Section has `description` field that can be updated
* Only registered users can retrieve `nonPublic` polls

## What is not expected to be implemented
* User details update
* Password reset
* Email sending
* Answers submission

## Limitations:
* DB is Postgres
* Framework is nestjs
* Types are important
* Tests are welcomed
* Linter is set up, feel free to update linter rules. Please use it before committing the code.

## Deliverables:
* Working API with instructions how to run it. Better if deployed somewhere (e.g. Heroku).
* Endpoints description w/contracts (Better if it's accessible Swagger)
* Description of solution drawbacks/limitations
* PR to this repo from the branch/fork you've created to complete the challenge
