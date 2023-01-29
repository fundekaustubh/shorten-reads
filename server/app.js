const express = require('express');
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(process.env.BACKEND_PORT,
    /**
     * Confirms server's success status, is triggered once the server begins.
     */
    () => {
        console.log(`Server started on port ${process.env.BACKEND_PORT}.`);
    })