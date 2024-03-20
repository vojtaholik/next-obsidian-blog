export function getBaseUrl() {
  return process.env.NODE_ENV === 'development'
    ? `http://localhost:${process.env.PORT}`
    : process.env.VERCEL_URL
}
