# Overview
This project involves the following tech stack:
- Express
- PostGresSQL
- Passport (For authentication)
- pg-connect-simple (For session-store)

# Link
> This project is hosted here: https://members-only-1dul.onrender.com/
- All environment variables and database setup has been done already.
- After long periods of inactivity the app will wind-down. So sometimes you'll have to wait for it to startup again (free tier haha).

# Premise
This project has the following features:
1) A PostGres SQL database that stores various users as well as a role.
2) Users can create messages that have a title, timestamp, text, etc. Database keeps track of who created each message.
3) Depending on one's role, it controls what message details they're able to see.
- Member role.
- Admin role.
4) Authentication and session management through passport.js

# Environment File
You will need the following values set (if running locally).
1. DB_PORT
2. PORT
3. DB_SECRET
4. UPGRADE_CODE
5. UPGRADE_ADMIN_CODE
