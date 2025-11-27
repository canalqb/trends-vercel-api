import express from "express";
import puppeteer from "puppeteer";

const app = express();

// Home
app.get("/", (req, res) => {
  res.send("API de Trends funcionando 🚀");
});

// Endpoint de trends
app.get("/api/trends", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.goto("https://trends24.in/brazil/", { waitUntil: "networkidle2" });

    const trends = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".trend-card .trend-card__name"))
                  .map(el => el.textContent.trim());
    });

    await browser.close();
    res.json({ trends });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Falha ao buscar trends" });
  }
});

// Start Express
export default app;
