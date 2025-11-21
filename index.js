const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// VUL HIER JOUW EULER API KEY IN
const EULER_API_KEY = "euler_MDEyOGViMjc2NmFjMjY2MjM5ZTVjYWNkNjRhZjc2ZDYzNzk0MThlMTU0Zjc0NDA5MmRiODk4";

// Proxy route
app.post("/sign", async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);

    const response = await fetch("https://api.eulerstream.com/v2/tiktok/signature", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": EULER_API_KEY
      },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();
    console.log("Euler response:", text);

    res.setHeader("Content-Type", "application/json");
    return res.send(text);

  } catch (err) {
    console.error("PROXY ERROR:", err);
    return res.status(500).json({ error: "proxy_error", details: err.toString() });
  }
});

app.listen(3000, () => console.log("Proxy running on port 3000"));
