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
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "*",
    credentials: true,
}));

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