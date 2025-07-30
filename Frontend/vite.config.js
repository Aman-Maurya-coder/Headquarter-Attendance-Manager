import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import react from '@vitejs/plugin-react'
// import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})