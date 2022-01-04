require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json())
app.use(cors())

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

const port = process.env.PORT || 4001

app.listen(port, () => { 
  console.log(`Server listening on port ${port}!`)
})