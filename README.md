# Welcome to Planavacay

## Our application

- Planavacay is an application that allows users to easily set up a trip by organizing it on our platform, we provide tools for the user to be able to have an easy access to the site and have his data stored, the user is going to have the possibility for a registration/login and with those will be able to create and see his planned vacations!
  It is very easy to use and has and will be implemented with a lot of cool features, so stay tuned!

## How to get it running locally

- We have implemented a Netlify hosted server connected to MongoDB via serverless functions
- To make it run in local you need to install the node package manager if node is already present in your device, in the CLI write "npm install", then you need the netlify CLI by writing "npm install netlify-cli -g"
- You can also use some commands to login and link your deployed application by running these commands "ntl login" and "ntl link" but we will not be needing these
- To run your server locally now the only thing left is for you to use "ntl dev" to locally host your application and we're set! you can now use the application locally
- If you're a member of this project you will also need to setup your .env file, to do so you need to create the file in your root directory "/travel-app" then manually insert MONGODB_URI:mongodb+srv://<name>:<password>@clustertravelapp.0xktvin.mongodb.net/
- Now if you're part of the project you need to know already or ask a member of the project the name and the password and replace it in the URI string,
  don't just replace name and password but also "<" and ">"
- This should do it, now you should have this project working and running smoothly

## Serverless functions

- All of the serverless functions go into the netlify\functions folder where you return the result of the function to the call
- The call itself is made via Axios which has been setup in the axios.js file as a plugin that works globally in the application and
  has been setup to call the /.netlify/functions folder by default

## Known Issues

- Creating .env file using the terminal on Windows caused issues before so if you get an XML error in the console try and create the .env by hand!
