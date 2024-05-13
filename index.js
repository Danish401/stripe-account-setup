const cors = require("cors");
const express = require("express");
// add a stripe key   add stripe security key
const stripe = require("stripe")("");
const uuid = require("uuid");

const app = express();

//middeleware

app.use(express.json());
app.use(cors());

//routes
app.get("/", (req, res) => {
  res.send("IT WORK AT LARNCODEONLINE");
});
app.post("/payment", (req, res) => {
  const { product, token } = req.body;
  console.log("Product ", product);
  console.log("Price", product.price);
  const idempontencyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: product.price * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `purchase product.name`,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
            },
          },
        },
        { idempontencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
});

// listen

const port = process.env.PORT || 5000;

app.listen(port, () => `Server running on port ${port} 🔥`);
