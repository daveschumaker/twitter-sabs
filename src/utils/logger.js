/* eslint-disable no-console */

// Simple logger to output various information to console or wherever
export const logger = (msg) => {
  const timestamp = new Date().toLocaleString()
  console.log(`[${timestamp}] ${msg}\n`)
}
