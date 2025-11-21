const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// Vul jouw Euler key in:
const EULER_API_KEY = "euler_MDEyOGViMjc2NmFjMjY2MjM5ZTVjYWNkNjRhZjc2ZDYzNzk0MThlMTU0Zjc0NDA5MmRiODk4";

// Mogelijke endpoints die we gaan testen
const endpoints = [
  "https://api.eulerstream.com/v2/tiktok/signature",
  "https://api.eulerstream.com/v1/tiktok/signature",
  "https://api.eulerstream.com/v1/live/signature",
  "https://api.eulerstream.com/tiktok/sign",
  "https://api.eulerstream.com/signature",
  "https://api.eulerstream.com/sign",
  "https://api.eulerstream.com/v2/sign",
  "https://api.eulerstream.com/v2/live/signature",
  "https://api.eulerstream.com/webcast/sign",
  "https://api.eulerstream.com/webcast/signature",
  "https://api.eulerstream.com/live/sign",
  "https://api.eulerstream.com/live/signature"
];

// ===== NORMAL SIGN ENDPOINT =====
app.post("/sign", async (req, res) => {
  try {
    // default endpoint (we override after scanning)
    const endpoint = "https://api.eulerstream.com/v2/tiktok/signature";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": EULER_API_KEY,
      },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();
    console.log("Normal sign response:", text);

    res.setHeader("Content-Type", "application/json");
    return res.send(text);

  } catch (err) {
    console.error("NORMAL SIGN ERROR:", err);
    return res.status(500).json({ error: "proxy_error", details: err.toString() });
  }
});

// ===== SCAN ENDPOINT =====
app.get("/scan", async (req, res) => {
  console.log("🚀 Starting Euler endpoint scan...");

  const results = [];

  for (const ep of endpoints) {
    console.log("Testing:", ep);

    try {
      const response = await fetch(ep, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": EULER_API_KEY
        },
        body: JSON.stringify({ test: true })
      });

      const status = response.status;
      const text = await response.text();

      results.push({
        endpoint: ep,
        status,
        body: text.substring(0, 200) // truncate
      });

      console.log(`➡️ ${ep} → [${status}]`);
    } catch (err) {
      results.push({
        endpoint: ep,
        error: err.toString()
      });
      console.log(`❌ ${ep} ERROR:`, err.toString());
    }
  }

  res.json({
    success: true,
    scanned: endpoints.length,
    results
  });
});

// ===== SERVER START =====
app.listen(3000, () => {
  console.log("Scanner proxy running on port 3000");
});
