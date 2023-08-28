const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cron = require('node-cron');
const routes = require("./routes");
const updatePrice = require("./utils/updatePrices");

require("dotenv").config();

const port = process.env.PORT || 4000;

const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());

app.use("/api/v1", routes);

cron.schedule('* * * * *', () => {
  updatePrice()
});

const server = app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
