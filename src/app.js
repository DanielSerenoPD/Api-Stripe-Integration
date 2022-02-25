require('dotenv').config();
const {PRIVATE} = process.env
const stripe = require('stripe')(PRIVATE);
const express = require('express');
const routes = require("./Routes");
const errorHandler = require('./Utils/Middlewares/ErrorHandler.js')
const PlansService = require("./Services/Plans");
const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

async function seeders() {
  await new PlansService().generatePlans();
}
seeders();
app.use('/',routes)
app.use(errorHandler)
module.exports = app