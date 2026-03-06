<template>
  <div class="sponsor-page">
    <h1>Sponsor a Student</h1>
    <p class="lead">Browse verified students and fund their education directly on Stellar blockchain.</p>

    <div class="filters">
      <input v-model="search" type="text" placeholder="Search by name or school..." />
      <select v-model="purposeFilter">
        <option value="">All Purposes</option>
        <option value="tuition">Tuition</option>
        <option value="books">Books</option>
        <option value="accommodation">Accommodation</option>
      </select>
    </div>

    <div v-if="loading" class="loading">Loading verified students...</div>

    <div v-else class="student-grid">
      <div v-for="student in filteredStudents" :key="student.id" class="student-card">
        <div class="student-header">
          <div class="avatar">{{ student.fullName[0] }}</div>
          <div>
            <h3>{{ student.fullName }}</h3>
            <p class="school">{{ student.school }}</p>
          </div>
        </div>
        <p class="story">{{ student.story }}</p>
        <div class="funding-info">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: fundingPercent(student) + '%' }"></div>
          </div>
          <p class="funding-text">
            ${{ student.amountRaised }} raised of ${{ student.amountNeeded }} ({{ fundingPercent(student) }}%)
          </p>
        </div>
        <button class="btn-sponsor" @click="openSponsorModal(student)">Sponsor Now</button>
      </div>

      <div v-if="filteredStudents.length === 0" class="empty">
        No verified students found. Check back soon.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const students = ref([])
const loading = ref(true)
const search = ref('')
const purposeFilter = ref('')

const filteredStudents = computed(() => {
  return students.value.filter(s => {
    const matchSearch = s.fullName.toLowerCase().includes(search.value.toLowerCase()) ||
                        s.school.toLowerCase().includes(search.value.toLowerCase())
    const matchPurpose = !purposeFilter.value || s.purpose === purposeFilter.value
    return matchSearch && matchPurpose
  })
})

function fundingPercent(student) {
  return Math.min(100, Math.round((student.amountRaised / student.amountNeeded) * 100))
}

function openSponsorModal(student) {
  // TODO: open payment modal with Stellar transaction
  alert(`Sponsoring ${student.fullName} — Stellar payment flow coming soon!`)
}

onMounted(async () => {
  try {
    const res = await axios.get('/api/students')
    students.value = res.data
  } catch {
    students.value = []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
h1 { font-size: 2rem; margin-bottom: 0.5rem; }
.lead { color: #64748b; margin-bottom: 2rem; }

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filters input, .filters select {
  padding: 0.65rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
}

.filters input { flex: 1; }
.filters input:focus, .filters select:focus { border-color: #0ea5e9; }

.student-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.student-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.student-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 48px;
  height: 48px;
  background: #0ea5e9;
  border-radius: 50%;
  color: white;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.student-header h3 { margin: 0; }
.school { color: #64748b; font-size: 0.85rem; margin: 0; }

.story {
  color: #475569;
  font-size: 0.9rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.progress-bar {
  background: #e2e8f0;
  border-radius: 4px;
  height: 8px;
  overflow: hidden;
}

.progress-fill {
  background: #0ea5e9;
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s;
}

.funding-text { font-size: 0.8rem; color: #64748b; margin-top: 0.35rem; }

.btn-sponsor {
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 0.7rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-sponsor:hover { background: #0284c7; }

.empty, .loading { color: #94a3b8; text-align: center; padding: 3rem; }
</style>
