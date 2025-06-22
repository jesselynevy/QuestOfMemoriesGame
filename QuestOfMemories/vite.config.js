import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        allowedHosts: [
            "aeef-2001-448a-2040-1d1-a5ef-5927-9263-7c0c.ngrok-free.app",
        ],
    },
});
