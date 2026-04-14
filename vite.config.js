import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Vite 5.4+ defaults server.cors to localhost / 127.0.0.1 / ::1 only (security).
 * Opening the dev server via a LAN IP (e.g. http://192.168.1.5:5173) sends a
 * different Origin header, so requests can fail without allowing private ranges.
 * @see https://vite.dev/config/server-options.html#server-cors
 */
const devCorsOrigin =
    /^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\]|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})(?::\d+)?$/;

export default defineConfig({
    plugins: [react()],
    server: {
        host: "0.0.0.0",
        port: 5173,
        cors: { origin: devCorsOrigin },
    },
    preview: {
        host: "0.0.0.0",
        port: 4173,
        cors: { origin: devCorsOrigin },
    },
});
