require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const studentRoutes = require('./src/routes/students')
const sponsorRoutes = require('./src/routes/sponsors')
const transactionRoutes = require('./src/routes/transactions')

const app = express()

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://tuishare.app'
    : 'http://localhost:5173',
  credentials: true
}))

// Rate limiting — prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
})
app.use('/api', limiter)

app.use(express.json({ limit: '10kb' }))

// Routes
app.use('/api/students', studentRoutes)
app.use('/api/sponsors', sponsorRoutes)
app.use('/api/transactions', transactionRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// Global error handler — never leak stack traces in production
app.use((err, req, res, next) => {
  console.error(err)
  const status = err.status || 500
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  res.status(status).json({ error: message })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Tuishare API running on port ${PORT}`)
})

module.exports = app
