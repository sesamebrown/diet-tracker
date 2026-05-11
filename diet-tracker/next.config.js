const isDev = process.env.NODE_ENV !== 'production'

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: isDev,
})

module.exports = withPWA({
  reactStrictMode: true,
})