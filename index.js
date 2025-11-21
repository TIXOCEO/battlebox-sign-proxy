const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// JOUW API KEY
const EULER_API_KEY = "euler_MDEyOGViMjc2NmFjMjY2MjM5ZTVjYWNkNjRhZjc2ZDYzNzk0MThlMTU0Zjc0NDA5MmRiODk4";

// TikTok Euler endpoint
const ENDPOINT = "https://tiktok.eulerstream.com/webcast/sign_url?client=ttlive-other";

// SIGN endpoint
app.post("/sign", async (req, res) => {
  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": EULER_API_KEY
      },
      body: JSON.stringify({
        url: req.body.url || "",
        userAgent: req.body.userAgent || "",
        method: req.body.method || "GET",
        sessionId: req.body.sessionId || "",
        ttTargetIdc: req.body.ttTargetIdc || "",
        ttwid: req.body.ttwid || "",
        payload: req.body.payload || "",
        type: req.body.type || "fetch",
        includeBrowserParams: true,
        includeVerifyFp: true
      })
    });

    const text = await response.text();
    console.log("Euler Response:", text);

    return res.send(text);

  } catch (err) {
    console.error("SIGN ERROR:", err);
    res.status(500).json({ error: "proxy_error", details: err.toString() });
  }
});

// RUN SERVER
app.listen(3000, () => {
  console.log("BattleBox Euler Proxy running on port 3000");
});
