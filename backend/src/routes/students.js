const express = require('express')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const router = express.Router()

// Restrict uploads to PDF and images only
const upload = multer({
  dest: process.env.UPLOAD_DIR || 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter(req, file, cb) {
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowed.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error('Only PDF and image files are allowed'))
    }
  }
})

// In-memory store for MVP — replace with DB in production
const students = []

// GET /api/students — list verified students
router.get('/', (req, res) => {
  const verified = students.filter(s => s.status === 'verified')
  res.json(verified)
})

// GET /api/students/:id
router.get('/:id', (req, res) => {
  const student = students.find(s => s.id === req.params.id)
  if (!student) return res.status(404).json({ error: 'Student not found' })
  res.json(student)
})

// POST /api/students/register
router.post('/register', upload.single('enrollmentDoc'), (req, res) => {
  const { fullName, email, school, amountNeeded, purpose, story } = req.body

  if (!fullName || !email || !school || !amountNeeded || !purpose || !story) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  if (!req.file) {
    return res.status(400).json({ error: 'Enrollment document is required' })
  }

  const student = {
    id: uuidv4(),
    fullName,
    email,
    school,
    amountNeeded: parseFloat(amountNeeded),
    amountRaised: 0,
    purpose,
    story,
    documentPath: req.file.path,
    status: 'pending', // pending | verified | rejected
    createdAt: new Date().toISOString()
  }

  students.push(student)
  res.status(201).json({ message: 'Application submitted', id: student.id })
})

module.exports = router
