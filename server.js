const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

// ✅ CORS config
app.use(cors({
  origin: ["https://haulgoat.com", "http://localhost:3000"],
  methods: ["POST", "GET"],
  allowedHeaders: ["Content-Type"]
}));

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
            product_data: { name: "Car Transport Service" },
            unit_amount: amount
          },
          quantity: 1
        }
      ],
      mode: "payment",
      success_url: "https://haulgoat.com/thank-you",
      cancel_url: "https://haulgoat.com/registration-form"
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error("Stripe session error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(4242, () => {
  console.log("✅ Server running on port 4242");
});
