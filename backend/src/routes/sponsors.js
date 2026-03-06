const express = require('express')
const router = express.Router()

// In-memory store for MVP — replace with DB in production
const sponsorships = []

// GET /api/sponsors/:walletAddress/sponsorships
router.get('/:walletAddress/sponsorships', (req, res) => {
  const { walletAddress } = req.params

  // Validate Stellar public key format (basic check)
  if (!/^G[A-Z2-7]{55}$/.test(walletAddress)) {
    return res.status(400).json({ error: 'Invalid wallet address' })
  }

  const results = sponsorships.filter(s => s.sponsorWallet === walletAddress)
  res.json(results)
})

// GET /api/sponsors/:walletAddress/transactions
router.get('/:walletAddress/transactions', (req, res) => {
  const { walletAddress } = req.params

  if (!/^G[A-Z2-7]{55}$/.test(walletAddress)) {
    return res.status(400).json({ error: 'Invalid wallet address' })
  }

  const results = sponsorships
    .filter(s => s.sponsorWallet === walletAddress && s.txHash)
    .map(s => ({
      hash: s.txHash,
      amount: s.amount,
      date: s.completedAt
    }))

  res.json(results)
})

// POST /api/sponsors/sponsor — initiate a sponsorship
router.post('/sponsor', (req, res) => {
  const { sponsorWallet, studentId, amount, txHash } = req.body

  if (!sponsorWallet || !studentId || !amount || !txHash) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  if (!/^G[A-Z2-7]{55}$/.test(sponsorWallet)) {
    return res.status(400).json({ error: 'Invalid sponsor wallet address' })
  }

  if (amount <= 0) {
    return res.status(400).json({ error: 'Amount must be positive' })
  }

  const sponsorship = {
    id: require('uuid').v4(),
    sponsorWallet,
    studentId,
    amount: parseFloat(amount),
    txHash,
    status: 'pending',
    createdAt: new Date().toISOString(),
    completedAt: null
  }

  sponsorships.push(sponsorship)
  res.status(201).json({ message: 'Sponsorship recorded', id: sponsorship.id })
})

module.exports = router
