import axios from "axios";

const httpsAgent = new (require("https").Agent)({
  rejectUnauthorized: false, // allow self-signed cert in dev
});

export async function pingBackend() {
  try {
    const res = await axios.get("https://localhost:8000/ping", {
      httpsAgent,
    });
    return res.data;
  } catch (err) {
    console.error("Ping failed", err);
    return null;
  }
}
