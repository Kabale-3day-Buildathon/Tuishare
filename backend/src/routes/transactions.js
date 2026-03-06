const express = require('express')
const StellarSdk = require('@stellar/stellar-sdk')
const router = express.Router()

const server = new StellarSdk.Horizon.Server(
  process.env.STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org'
)

// GET /api/transactions/:hash — verify a transaction on Stellar
router.get('/:hash', async (req, res) => {
  const { hash } = req.params

  // Validate hash format (64 hex chars)
  if (!/^[a-fA-F0-9]{64}$/.test(hash)) {
    return res.status(400).json({ error: 'Invalid transaction hash' })
  }

  try {
    const tx = await server.transactions().transaction(hash).call()
    res.json({
      hash: tx.hash,
      ledger: tx.ledger,
      createdAt: tx.created_at,
      successful: tx.successful,
      feeCharged: tx.fee_charged
    })
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ error: 'Transaction not found' })
    }
    res.status(500).json({ error: 'Failed to fetch transaction' })
  }
})

module.exports = router
