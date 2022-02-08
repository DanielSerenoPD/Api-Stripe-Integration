require('dotenv').config();
const {STRIPE_PRIVATE_KEY} = process.env
const {Router} = require('express');
const stripe = require('stripe')(STRIPE_PRIVATE_KEY);
const router = Router();
router.post('/', async (req, res, next) => {
  try{
    const customer = await stripe.customers.create({
      email: req.body.email,
    });
    res.send({ customer: customer });
  }catch(error){
      next(error);
  }
});

router.post('/update', async (req, res, next) => {
  try{
  const {customerId, payload} = req.body;
  const customer = await stripe.customers.update(
    customerId,
    payload
  );
  res.send({ customer: customer });
}catch(error){
  next(error);
}
});

module.exports = router;