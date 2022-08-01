## BE NC-NEWS

## Connect to the databases

'.env.\*' has been added to the .gitignore, anyone who wishes to clone this repo will need to create the environment variables by creating the following files:

         - '.env.development'
         - '.env.test'

In each file, you will need to set the PGDATABASE to the name of the corresponding database:

        - PGDATABASE=database_name

The name of the databases can be found in './db/setup.sql'.
