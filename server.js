const express = require("express");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data.json");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

// Get all investor data
app.get("/api/investors", (req, res) => {
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Could not read data" });
        res.json(JSON.parse(data));
    });
});

// Update investor data (Manager only)
app.post("/api/investors", (req, res) => {
    const { password, investors } = req.body;

    if (password !== process.env.ADMIN_PASS) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    fs.writeFile(DATA_FILE, JSON.stringify(investors, null, 2), err => {
        if (err) return res.status(500).json({ error: "Could not save data" });
        res.json({ message: "Data updated successfully" });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
