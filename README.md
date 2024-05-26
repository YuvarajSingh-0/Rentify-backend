# Rentify

Rentify-Backend is a Node.js application that uses Prisma for database operations, bcrypt for password hashing, jsonwebtoken for authentication, and nodemailer for sending emails.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm

### Installing

1. Clone the repository
```sh
git clone https://github.com/YuvarajSingh-0/Rentify-backend.git
```
2. Install Dependencies
```sh
npm install
```
3. Set up your environment variables in a `.env` file in the root directory. You will need the following variables:
```
DATABASE_URL
DIRECT_URL
UPLOADTHING_SECRET
UPLOADTHING_APP_ID
JWT_SECRET
MAIL_USERNAME
MAIL_PASSWORD
```
4. Run the application
```sh
npm start
```

### Built With

- [Node.js](https://nodejs.org/)
- [Prisma](https://www.prisma.io/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [nodemailer](https://www.npmjs.com/package/nodemailer)

### Authors
- [Yuvaraj Singh](https://www.github.com/yuvarajsingh-0)

### Routes

Authentication Routes (/auth): Implemented in `src/routes/auth.routes.js`. 
POST `/auth/register`
POST `/auth/login`
POST `/auth/logout`

Property Routes (/property): Implemented in `src/routes/property.routes.js`. The specific routes include:

POST `/property/new`: Add a new property
GET `/property/self`: Fetches properties of a loggedin user(SELLER)
GET `/property/all`: Fetch all properties
- this route can get query params of :
    - page, limit for pagination
    - search value for keywords searching
    - sort and order for sorting the properties

User Routes (/user): Implemented in src/routes/user.routes.js. The specific routes include:

GET `/checkUserLoggedIn`: Check if a user is logged in
PUT `/`: Update user details
GET `/`: Get user details
