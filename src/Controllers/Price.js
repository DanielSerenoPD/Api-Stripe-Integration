require('dotenv').config();
const {STRIPE_PRIVATE_KEY} = process.env
const stripe = require('stripe')(STRIPE_PRIVATE_KEY);
const {Router} = require("express")
const router = Router()
router.get('/', async (req, res, next) => {
  try{
    const prices = await stripe.prices.list({
      lookup_keys: ['5_clases', '10_clases', '15_clases'],
      expand: ['data.product']
    });
    res.send({
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      prices: prices.data,
    });
  }catch(error){
    next(error);
}
})
module.exports = router;