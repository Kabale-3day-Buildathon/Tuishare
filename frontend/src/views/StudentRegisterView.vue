<template>
  <div class="register-page">
    <h1>Register as a Student</h1>
    <p class="lead">Fill in your details and upload supporting documents. Our team will verify your profile within 48 hours.</p>

    <form class="register-form" @submit.prevent="submitForm">
      <div class="form-group">
        <label>Full Name</label>
        <input v-model="form.fullName" type="text" placeholder="e.g. Jane Mwangi" required />
      </div>

      <div class="form-group">
        <label>Email Address</label>
        <input v-model="form.email" type="email" placeholder="jane@example.com" required />
      </div>

      <div class="form-group">
        <label>School / University</label>
        <input v-model="form.school" type="text" placeholder="e.g. University of Nairobi" required />
      </div>

      <div class="form-group">
        <label>Amount Needed (USDC)</label>
        <input v-model="form.amountNeeded" type="number" min="1" placeholder="e.g. 500" required />
      </div>

      <div class="form-group">
        <label>Purpose</label>
        <select v-model="form.purpose" required>
          <option value="">Select a purpose</option>
          <option value="tuition">Tuition Fees</option>
          <option value="books">Books & Supplies</option>
          <option value="accommodation">Accommodation</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div class="form-group">
        <label>Your Story</label>
        <textarea v-model="form.story" rows="4" placeholder="Tell sponsors why you need help and what you're studying..." required></textarea>
      </div>

      <div class="form-group">
        <label>Enrollment Document (PDF/Image)</label>
        <input type="file" @change="handleFileUpload" accept=".pdf,.jpg,.jpeg,.png" required />
      </div>

      <button type="submit" class="btn-submit" :disabled="submitting">
        {{ submitting ? 'Submitting...' : 'Submit Application' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const form = ref({
  fullName: '',
  email: '',
  school: '',
  amountNeeded: '',
  purpose: '',
  story: ''
})

const enrollmentDoc = ref(null)
const submitting = ref(false)

function handleFileUpload(event) {
  enrollmentDoc.value = event.target.files[0]
}

async function submitForm() {
  submitting.value = true
  try {
    const data = new FormData()
    Object.entries(form.value).forEach(([key, val]) => data.append(key, val))
    data.append('enrollmentDoc', enrollmentDoc.value)

    await axios.post('/api/students/register', data)
    alert('Application submitted! We will verify your profile within 48 hours.')
  } catch (err) {
    alert('Submission failed. Please try again.')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.register-page {
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.lead {
  color: #64748b;
  margin-bottom: 2rem;
}

.register-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #374151;
}

input, select, textarea {
  padding: 0.65rem 0.9rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
}

input:focus, select:focus, textarea:focus {
  border-color: #0ea5e9;
}

.btn-submit {
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 0.85rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background: #0284c7;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
