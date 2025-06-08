const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  const { amount } = req.body;

  try {
    if (!amount) throw new Error("Missing amount");

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
    console.error("Stripe error:", err);
    res.status(500).json({ error: "Failed to create Stripe session" });
  }
});

app.listen(4242, () => {
  console.log("Server running on port 4242");
  console.log("Stripe Key:", process.env.STRIPE_SECRET_KEY ? "✅ Present" : "❌ MISSING");
});
