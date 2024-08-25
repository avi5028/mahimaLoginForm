const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/authDB");

// Schema definition
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send("All fields are required.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.send(
      'Signup successful! You can now <a href="http://localhost:5500/login.html">login</a>.'
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred during signup.");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send("All fields are required.");
    }

    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.send("Login successful! Welcome " + username);
    } else {
      res.status(401).send("Invalid username or password");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred during login.");
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
