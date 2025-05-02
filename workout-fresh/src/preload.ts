import { contextBridge } from 'electron';
import axios from 'axios';

contextBridge.exposeInMainWorld('api', {
  ping: async () => {
    try {
      const res = await axios.get("https://localhost:8000/ping");
      return res.data;
    } catch (err) {
      console.error("Ping error in preload:", err);
      return null;
    }
  },
});
