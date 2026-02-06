import Stripe from "stripe";
import { NextResponse } from "next/server";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY not set");
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

const PRODUCTS = {
  sqli: { name: "CyberAI Fix  SQL Injection", description: "Correction complete : requetes parametrees, ORM, validation.", price: 14900, severity: "critical" },
  xss: { name: "CyberAI Fix  Cross-Site Scripting", description: "Correction complete : echappement HTML, CSP, DOMPurify.", price: 9900, severity: "high" },
  csrf: { name: "CyberAI Fix  CSRF Protection", description: "Correction complete : tokens CSRF, SameSite cookies.", price: 4900, severity: "medium" },
  header_sec: { name: "CyberAI Fix  Security Headers", description: "Correction complete : HSTS, CSP, X-Frame-Options, helmet.js.", price: 4900, severity: "medium" },
  rce: { name: "CyberAI Fix  Remote Code Execution", description: "Correction complete : execFile whitelist, sandboxing.", price: 14900, severity: "critical" },
  auth_bypass: { name: "CyberAI Fix  Auth Bypass", description: "Correction complete : JWT verification, middleware auth.", price: 14900, severity: "critical" },
  ssrf: { name: "CyberAI Fix  SSRF Protection", description: "Correction complete : validation URL, blocage reseau interne.", price: 9900, severity: "high" },
  lfi: { name: "CyberAI Fix  Local File Inclusion", description: "Correction complete : whitelist fichiers, path normalization.", price: 9900, severity: "high" },
  idor: { name: "CyberAI Fix  IDOR Protection", description: "Correction complete : verification permissions, UUIDs.", price: 9900, severity: "high" },
  info_leak: { name: "CyberAI Fix  Information Leak", description: "Correction complete : erreurs generiques, suppression headers.", price: 1900, severity: "low" },
};

async function getOrCreateCoupon(stripe, percent) {
  const couponId = "BUNDLE_" + percent;
  try { return (await stripe.coupons.retrieve(couponId)).id; }
  catch { return (await stripe.coupons.create({ id: couponId, percent_off: percent, duration: "once", name: "Pack CyberAI -" + percent + "%" })).id; }
}

export async function POST(request) {
  try {
    const stripe = getStripe();
    const body = await request.json();
    const { vulnType, sessionId, target, types } = body;

    if (vulnType === "bundle" && types && types.length > 0) {
      const lineItems = types.map(t => {
        const p = PRODUCTS[t];
        if (!p) return null;
        return { price_data: { currency: "eur", product_data: { name: p.name, description: p.description }, unit_amount: p.price }, quantity: 1 };
      }).filter(Boolean);
      const discount = types.length >= 3 ? 20 : types.length >= 2 ? 10 : 0;
      const sessionOpts = {
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: (process.env.NEXT_PUBLIC_BASE_URL || "") + "/checkout/success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: (process.env.NEXT_PUBLIC_BASE_URL || "") + "/checkout/cancel",
        metadata: { pentest_session: sessionId || "", target: target || "", vuln_types: types.join(","), bundle: "true" },
      };
      if (discount > 0) sessionOpts.discounts = [{ coupon: await getOrCreateCoupon(stripe, discount) }];
      const session = await stripe.checkout.sessions.create(sessionOpts);
      return NextResponse.json({ url: session.url, sessionId: session.id });
    }

    const product = PRODUCTS[vulnType];
    if (!product) return NextResponse.json({ error: "Unknown type: " + vulnType }, { status: 400 });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price_data: { currency: "eur", product_data: { name: product.name, description: product.description }, unit_amount: product.price }, quantity: 1 }],
      mode: "payment",
      success_url: (process.env.NEXT_PUBLIC_BASE_URL || "") + "/checkout/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: (process.env.NEXT_PUBLIC_BASE_URL || "") + "/checkout/cancel",
      metadata: { pentest_session: sessionId || "", target: target || "", vuln_type: vulnType },
    });
    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Stripe error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
