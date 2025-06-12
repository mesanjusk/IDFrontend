// /api/pinger.js
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://idbackend-rf1u.onrender.com';

export default async function handler(req, res) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ping`);
    const data = await response.text();
    res.status(200).send(`Pinged backend: ${data}`);
  } catch (error) {
    console.error("Ping failed:", error);
    res.status(500).send("Ping failed");
  }
}
