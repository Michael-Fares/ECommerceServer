require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json())
app.use(cors())
const storeItems = require('./storeItems.js')
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

app.get('/', (req, res) => {
  res.send('Welcome to my server!')
})

app.post('/create-checkout-session', async (req, res) => {
  try {
    const itemsSentForCharge = req.body.checkoutItemsToServer
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      line_items: itemsSentForCharge.map(item => {
        const matchedStoreItem = storeItems.find(storeItem => item.id === storeItem.id)
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: matchedStoreItem.title
            },
            unit_amount: matchedStoreItem.price * 100
          },
          quantity: item.quantity
        }
      })
    })
    res.json({ url: session.url })
  } catch(error) {
    res.status(500).json({error: error.message})
  }
})

const port = process.env.PORT || 4001

app.listen(port, () => { 
  console.log(`Server listening on port ${port}!`)
})