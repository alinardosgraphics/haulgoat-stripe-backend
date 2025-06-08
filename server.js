const express = require("express");
const stripe = require("stripe")("sk_test_YOUR_SECRET_KEY"); // Replace with your Stripe secret key
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  const { amount } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Car Transport Service",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://haulgoat.com/thank-you",
      cancel_url: "https://haulgoat.com/registration-form",
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Stripe session creation failed" });
  }
});

app.listen(4242, () => console.log("Server running on port 4242"));
