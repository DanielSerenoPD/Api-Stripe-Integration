require('dotenv').config();
const {STRIPE_PRIVATE_KEY} = process.env
const stripe = require('stripe')(STRIPE_PRIVATE_KEY);
const express = require('express');
const routes = require("./Routes");
const errorHandler = require('./Utils/Middlewares/ErrorHandler.js')
const PlansService = require("./Services/plans");
const app = express();
const cors = require('cors');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authortization",
    ],
  })
);

async function seeders() {
  await new PlansService().generatePlans();
}
seeders();
app.use('/',routes)
app.use(errorHandler)
module.exports = app