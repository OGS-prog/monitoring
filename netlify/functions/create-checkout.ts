// netlify/functions/create-checkout.ts
//
// This Netlify function creates a Stripe Checkout Session
// with a recurring monthly subscription and sends a confirmation email.
//
// SETUP STEPS:
// 1. npm install stripe
// 2. In your Netlify dashboard → Site settings → Environment variables, add:
//    STRIPE_SECRET_KEY = sk_live_xxxx  (or sk_test_xxxx for testing)
//    STRIPE_PRICE_ID   = price_xxxx    (create this in Stripe dashboard — see note below)
//    SITE_URL          = https://www.omegagreensolutions.com.au
//
// HOW TO CREATE THE STRIPE PRICE:
//   - Go to stripe.com → Products → Add product
//   - Name: "Daily Solar & Battery Monitoring"
//   - Pricing: Recurring, $30 AUD/month  (or $30.41 for 31-day months — up to you)
//   - Copy the Price ID (starts with price_) → paste into STRIPE_PRICE_ID env var
//
// INVOICE NOTE:
//   Stripe automatically sends a PDF invoice email to the customer each month.
//   You don't need to do anything extra for invoicing — it's built into Stripe subscriptions.

import Stripe from "stripe";
import { Handler } from "@netlify/functions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body: {
    name: string;
    email: string;
    address: string;
    inverterSerial: string;
  };

  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request body" }) };
  }

  const { name, email, address, inverterSerial } = body;

  if (!name || !email || !address || !inverterSerial) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "All fields are required" }),
    };
  }

  try {
    // Create or retrieve Stripe customer
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customer: Stripe.Customer;

    if (customers.data.length > 0) {
      customer = customers.data[0];
      // Update metadata with latest info
      customer = await stripe.customers.update(customer.id, {
        name,
        metadata: { address, inverterSerial },
      });
    } else {
      customer = await stripe.customers.create({
        name,
        email,
        metadata: { address, inverterSerial },
      });
    }

    // Create Stripe Checkout Session (subscription)
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      // Stripe automatically sends invoice emails each month
      invoice_creation: undefined, // Not needed in subscription mode — invoices are automatic
      subscription_data: {
        metadata: {
          customerName: name,
          propertyAddress: address,
          inverterSerial,
        },
      },
      success_url: `${process.env.SITE_URL}/?success=true#monitoring`,
      cancel_url: `${process.env.SITE_URL}/#monitoring`,
      // Pre-fill customer email in Stripe checkout
      customer_email: undefined, // already set via customer object
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error("Stripe error:", err);
    const message = err instanceof Error ? err.message : "Stripe error";
    return {
      statusCode: 500,
      body: JSON.stringify({ error: message }),
    };
  }
};

export { handler };
