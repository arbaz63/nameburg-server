const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cron = require('node-cron');
const routes = require("./src/routes");
const updatePrice = require("./src/utils/updatePrices");

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
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.use(cors(corsOptions));

app.use("/api/v1", routes);

app.get('/', (req, res)=>res.json({message:'success'}))

// cron.schedule('* * * * *', () => {
//   updatePrice()
// });

const server = app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
