// ════════════════════════════════════════════════
// /api/crear-orden-binance.js
// Función serverless de Vercel — NO corre en el navegador.
// Aquí (y solo aquí) se usa el Secret Key de Binance Pay,
// protegido como variable de entorno en el servidor.
// ════════════════════════════════════════════════

import crypto from "crypto";

// ────────────────────────────────────────────────
// Credenciales — se leen de las Variables de Entorno
// de Vercel, NUNCA se escriben aquí directamente.
// ────────────────────────────────────────────────
const BINANCE_API_KEY = process.env.BINANCE_PAY_API_KEY;
const BINANCE_SECRET_KEY = process.env.BINANCE_PAY_SECRET_KEY;
const BINANCE_PAY_URL = "https://bpay.binanceapi.com/binancepay/openapi/v3/order";

// Precios oficiales de ContaQuiz (definidos aquí también,
// nunca confiar en el precio que venga del navegador —
// así nadie puede manipular el monto a pagar)
const PRECIOS = {
  mensual: { amount: "4.99", currency: "USDT", descripcion: "ContaQuiz - Suscripción Mensual" },
  anual: { amount: "46.99", currency: "USDT", descripcion: "ContaQuiz - Suscripción Anual" },
};

function generarNonce() {
  return crypto.randomBytes(16).toString("hex").toUpperCase();
}

function firmarPeticion(timestamp, nonce, body) {
  const payload = `${timestamp}\n${nonce}\n${body}\n`;
  return crypto
    .createHmac("sha512", BINANCE_SECRET_KEY)
    .update(payload)
    .digest("hex")
    .toUpperCase();
}

export default async function handler(req, res) {
  // Solo aceptar solicitudes POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { plan, uid, email } = req.body;

    // Validación: el plan debe ser uno de los oficiales (evita manipulación de precio)
    if (!PRECIOS[plan]) {
      return res.status(400).json({ error: "Plan inválido" });
    }
    if (!uid) {
      return res.status(400).json({ error: "Falta el identificador de usuario" });
    }

    const { amount, currency, descripcion } = PRECIOS[plan];
    const merchantTradeNo = `CQ-${uid.slice(0, 8)}-${Date.now()}`;

    const bodyObj = {
      env: { terminalType: "WEB" },
      merchantTradeNo,
      orderAmount: amount,
      currency,
      description: descripcion,
      goodsDetails: [
        {
          goodsType: "02", // 02 = Virtual Goods
          goodsCategory: "Z000", // Otros / Software y servicios
          referenceGoodsId: `contaquiz-${plan}`,
          goodsName: descripcion,
        },
      ],
      returnUrl: "https://contaquiz.com/?pago=exitoso",
      cancelUrl: "https://contaquiz.com/?pago=cancelado",
    };

    const bodyStr = JSON.stringify(bodyObj);
    const timestamp = Date.now().toString();
    const nonce = generarNonce();
    const signature = firmarPeticion(timestamp, nonce, bodyStr);

    const binanceResponse = await fetch(BINANCE_PAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "BinancePay-Timestamp": timestamp,
        "BinancePay-Nonce": nonce,
        "BinancePay-Certificate-SN": BINANCE_API_KEY,
        "BinancePay-Signature": signature,
      },
      body: bodyStr,
    });

    const data = await binanceResponse.json();

    if (data.status !== "SUCCESS") {
      console.error("Error de Binance Pay:", JSON.stringify(data));
      return res.status(502).json({ error: "No se pudo crear la orden de pago", detalle: data, code: data.code, message: data.errorMessage || data.message });
    }

    // Devolvemos al navegador SOLO la información necesaria para mostrar el pago
    // (nunca las credenciales, nunca el secret key)
    return res.status(200).json({
      checkoutUrl: data.data.checkoutUrl,
      qrcodeLink: data.data.qrcodeLink,
      deeplink: data.data.deeplink,
      prepayId: data.data.prepayId,
      merchantTradeNo,
    });
  } catch (error) {
    console.error("Error interno creando orden Binance Pay:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
