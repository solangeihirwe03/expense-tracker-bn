const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) =>
  res.status(200).json({ message: "Welcome to expense tracker APIs" })
);

const port = process.env.PORT || 3030;

app.listen(port, () => console.log(`Server is listening on port ${port}`));
