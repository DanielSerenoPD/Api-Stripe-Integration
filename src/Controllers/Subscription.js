require('dotenv').config();
const {STRIPE_PRIVATE_KEY, STRIPE_PUBLISHABLE_KEY} = process.env
const stripe = require('stripe')(STRIPE_PRIVATE_KEY);
const { Router } = require("express");
const router = Router();
router.post("/create-subscription", async (req, res, next) => {
  //obtenemos el customer
  //const {customerId} = req.cookies["customer"];
  // obtenemos el id del precio desde el frontend
  //creamos la subscription
  try {
    const {priceId, customerId }= req.body;
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });
    //almacenar datos de subscription en firebase
    res.send({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      clientPublishable: STRIPE_PUBLISHABLE_KEY,
      customerId,
      priceId
    });
  }catch(error){
    next(error);
}
});
router.post("/cancel-subscription", async (req, res, next) => {
  // Cancel the subscription
  try {
    const deletedSubscription = await stripe.subscriptions.del(
      req.body.subscriptionId
    );

    res.send({ subscription: deletedSubscription });
  }catch(error){
    next(error);
}
});

router.post("/update-subscription", async (req, res, next) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(
      req.body.subscriptionId
    );
    const updatedSubscription = await stripe.subscriptions.update(
      req.body.subscriptionId,
      {
        items: [
          {
            id: subscription.items.data[0].id,
            price: process.env[req.body.newPriceLookupKey.toUpperCase()],
          },
        ],
      }
    );

    res.send({ subscription: updatedSubscription });
  }catch(error){
    next(error);
}
});
router.get('/', async (req, res, next) => {
  try{
  const {customerId} = req.body;
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'all',
    expand: ['data.default_payment_method'],
  });
  res.json({subscriptions:subscriptions.data});
}catch(error){
  next(error);
}
});
module.exports = router;
