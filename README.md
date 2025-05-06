# Overview
This project involves the following tech stack:
- Express
- PostGresSQL
- Passport (For authentication)
- pg-connect-simple (For session-store)

# Premise
This project has the following features:
1) A database that stores various users as well as a role.
2) Users can create messages that have a title, timestamp, text, etc. Database keeps track of who created each message.
3) Depending on one's role, it controls what message details they're able to see.

# Environment File
You will need the following values set:
1. SERVER_PORT -> whatever port you want the app to run on.
2. POOL_USER -> the user owner of the database.
3. UPGRADE_CODE -> just set this to "upgademe". This is for the feature where the user can upgrade their status.
