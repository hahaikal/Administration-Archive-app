const app = require('./index')
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT;
const mongoURI = process.env.ATLAS_CONNECTION;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDB connected successfully");
}).catch(err => {
    console.error("MongoDB connection error:", err);
    console.error("Please verify your connection string, network access, and IP whitelist settings.");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});