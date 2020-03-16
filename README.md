# Courses REST API

NOTE FOR REVIEWER:

If you test authentication, please remember that the database is seeded with a user named Joe Smith whose password is not hashed. You cannot use that user to authenticate. Only users whose passwords have been hashed can be authenticated. Also, attempting to update or delete course 1 will fail, because that course is owned by Joe Smith.

## What is this?

Courses REST API is a demonstration REST API built using Node.js, Express.js, Sequelize ORM and SQLite. 
