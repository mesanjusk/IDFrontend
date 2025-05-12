// /api/pinger.js
export default async function handler(req, res) {
  try {
    const response = await fetch("https://idbackend-rf1u.onrender.com/api/ping");
    const data = await response.text();
    res.status(200).send(`Pinged backend: ${data}`);
  } catch (error) {
    console.error("Ping failed:", error);
    res.status(500).send("Ping failed");
  }
}
