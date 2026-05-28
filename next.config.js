/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['affront-modular-qualm.ngrok-free.dev'], // reemplaza con tu URL ngrok activa
  reactStrictMode: true,
  turbopack: {}, // configuración vacía para habilitar Turbopack sin errores
}

module.exports = nextConfig
