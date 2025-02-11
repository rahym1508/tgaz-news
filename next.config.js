/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'iy.kommersant.ru',
        port: '',
        pathname: '/**',
      },
      // Add more domains as needed
      {
        protocol: 'https',
        hostname: '*.rbc.ru',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.interfax.ru',
        port: '',
        pathname: '/**',
      }
    ],
  },
}

module.exports = nextConfig 