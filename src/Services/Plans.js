require('dotenv').config();
const {STRIPE_PRIVATE_KEY} = process.env
const stripe = require("stripe")(STRIPE_PRIVATE_KEY)
const db = require("../Firebase");
const preferencesPlans = require("./PreferencesPlans");
const prices = require("./Prices");
class PlansService {
  constructor() {
    this.plans = [];
  }
  async generatePlans() {
    try {
      const plans = await db.collection("Plans").get();
      console.log(plans.size)
      if(!plans.size){
      let planBasic = await stripe.products.create(preferencesPlans.planBasic);
      let planStandard = await stripe.products.create(preferencesPlans.planStandard);
      let planPremium = await stripe.products.create(preferencesPlans.planPremium);
      this.asociatePrices([planBasic, planStandard, planPremium])
      let priceBasic = await stripe.prices.create(prices.priceBasic);
      let priceStandard = await stripe.prices.create(prices.priceStandard);
      let pricePremium = await stripe.prices.create(prices.pricePremium);
      await db.collection("Plans").doc(priceBasic.id).set({price:priceBasic.id, product:planBasic.id});
      await db.collection("Plans").doc(priceStandard.id).set({price:priceStandard.id, product:planStandard.id});
      await db.collection("Plans").doc(pricePremium.id).set({price:pricePremium.id, product:planPremium.id});
    }
    } catch (error) {
      throw new Error(error.message);
    }
  }
  
    asociatePrices(products) {
    prices.priceBasic["product"] = products[0].id;
    prices.priceStandard["product"] = products[1].id;
    prices.pricePremium["product"] = products[2].id;
  }

    
}

module.exports = PlansService;
