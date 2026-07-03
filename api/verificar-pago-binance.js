// ════════════════════════════════════════════════
// /api/verificar-pago-binance.js
// Función serverless para consultar si una orden
// de Binance Pay ya fue completada por el usuario.
// ════════════════════════════════════════════════

import crypto from "crypto";

const BINANCE_API_KEY = process.env.BINANCE_PAY_API_KEY;
const BINANCE_SECRET_KEY = process.env.BINANCE_PAY_SECRET_KEY;
const BINANCE_QUERY_URL = "https://bpay.binanceapi.com/binancepay/openapi/v2/order/query";

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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { merchantTradeNo } = req.body;
    if (!merchantTradeNo) {
      return res.status(400).json({ error: "Falta merchantTradeNo" });
    }

    const bodyObj = { merchantTradeNo };
    const bodyStr = JSON.stringify(bodyObj);
    const timestamp = Date.now().toString();
    const nonce = generarNonce();
    const signature = firmarPeticion(timestamp, nonce, bodyStr);

    const binanceResponse = await fetch(BINANCE_QUERY_URL, {
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
      return res.status(502).json({ error: "No se pudo verificar la orden", detalle: data });
    }

    // data.data.status puede ser: INITIAL | PENDING | PAID | CANCELED | ERROR | REFUNDING | REFUNDED | EXPIRED
    return res.status(200).json({ estado: data.data.status, detalle: data.data });
  } catch (error) {
    console.error("Error verificando pago Binance Pay:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
