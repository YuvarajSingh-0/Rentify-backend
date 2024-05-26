const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

//Import the routes
const authRoutes = require('./routes/auth.routes');
const propertyRoutes = require('./routes/property.routes')
const userRoutes = require('./routes/user.routes')

// Create the express app
const app = express();
const port = 9000;

// Middlewares
app.use((req, res, next) => {
    res.setHeader(
        "Access-Control-Allow-Origin",
        "https://master--presidio-assignment.netlify.app"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Private-Network", true);
    //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
    res.setHeader("Access-Control-Max-Age", 7200);

    next();
});
// app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Register API routes
app.use("/auth", authRoutes);
app.use("/property", propertyRoutes);
app.use('/user', userRoutes);
app.get("/", (req, res) => {
    res.send("Presidio API");
});

// Catch unregistered routes
app.all("*", (req, res) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});