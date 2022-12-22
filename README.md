# NC News Backend

Hello!

This is the backend for my Northcoders project, NC News.  NC News is an application in which a user can view various articles, sort articles by topic, votes, comment counts and other sorting methods. 

This is my first API, hosted with ElephantSQL & Render: https://ncnews-backend.onrender.com/api/

## Connect to the databases

'.env.\*' has been added to the .gitignore. 
Anyone who wishes to fork and clone this repository will need to run the command: 'npm install' to install the relevant packages. 
Then you will need to create the environment variables by creating the following files:

         - '.env.development'
         - '.env.production'
         - '.env.test'

In each file, you will need to set the PGDATABASE to the name of the corresponding database:

        - PGDATABASE=database_name

The name of the databases can be found in './db/setup.sql'.
