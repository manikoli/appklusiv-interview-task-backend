# Express MongoDB TypeScript App with Session
## This repository contains an Express web application that uses MongoDB to store user data and implements session management using the express-session library. The app is also built with TypeScript for type checking and improved developer experience.

Installation
To run the app locally, please follow these instructions:

First, you need to have MongoDB installed on your machine. You can download and install it from the official website: https://www.mongodb.com/try/download/community

Run yarn install to install the necessary dependencies.

Once the dependencies have been installed, create a new database in MongoDB called `appklusiv_db` by running the following command in the terminal:

```
mongo
use appklusiv_db
```
Create a new collection called users in the `appklusiv_db` database by running the following command:

```
db.createCollection("users")
```

After that you'll have to build the app by running `yarn build`.

Finally, start the app by running `yarn start` in the terminal.

The app will be running on http://localhost:3001 and it can be accessed trough api.
