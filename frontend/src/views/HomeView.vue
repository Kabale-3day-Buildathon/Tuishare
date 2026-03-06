<template>
  <div class="home">
    <section class="hero">
      <h1>Fund Education.<br />Directly. Transparently.</h1>
      <p class="subtitle">
        Tuishare connects sponsors directly to verified students using Stellar blockchain.
        No middlemen. No scams. Funds go straight to institutions.
      </p>
      <div class="hero-actions">
        <RouterLink to="/sponsor" class="btn btn-primary">Sponsor a Student</RouterLink>
        <RouterLink to="/student/register" class="btn btn-secondary">I Need Sponsorship</RouterLink>
      </div>
    </section>

    <section class="stats">
      <div class="stat">
        <span class="stat-value">0</span>
        <span class="stat-label">Students Verified</span>
      </div>
      <div class="stat">
        <span class="stat-value">0</span>
        <span class="stat-label">Sponsors Active</span>
      </div>
      <div class="stat">
        <span class="stat-value">$0</span>
        <span class="stat-label">Disbursed On-Chain</span>
      </div>
    </section>

    <section class="how-it-works">
      <h2>How It Works</h2>
      <div class="steps">
        <div class="step">
          <div class="step-num">1</div>
          <h3>Student Registers</h3>
          <p>Upload enrollment proof and fee statement. Our team verifies your documents.</p>
        </div>
        <div class="step">
          <div class="step-num">2</div>
          <h3>Sponsor Commits</h3>
          <p>Browse verified students and fund a specific need via Stellar USDC.</p>
        </div>
        <div class="step">
          <div class="step-num">3</div>
          <h3>Funds Go to Institution</h3>
          <p>Smart contracts release payment directly to the school — on-chain receipt for everyone.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 4rem 1rem;
}

.hero h1 {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 1.25rem;
  color: #0f172a;
}

.subtitle {
  font-size: 1.2rem;
  color: #475569;
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-primary {
  background: #0ea5e9;
  color: white;
}

.btn-primary:hover {
  background: #0284c7;
}

.btn-secondary {
  background: white;
  color: #0f172a;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover {
  border-color: #0ea5e9;
  color: #0ea5e9;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 4rem;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  margin-bottom: 4rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: #0ea5e9;
}

.stat-label {
  color: #64748b;
  font-size: 0.9rem;
}

.how-it-works h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2.5rem;
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
}

.step {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.step-num {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #0ea5e9;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.step h3 {
  margin-bottom: 0.5rem;
}

.step p {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
}
</style>
