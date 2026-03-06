<template>
  <nav class="navbar">
    <div class="navbar-inner">
      <RouterLink to="/" class="brand">Tuishare</RouterLink>

      <div class="nav-links">
        <RouterLink to="/sponsor">Find Students</RouterLink>
        <RouterLink to="/student/register">Register as Student</RouterLink>
        <RouterLink to="/dashboard">Dashboard</RouterLink>
      </div>

      <WalletConnect />
    </div>
  </nav>
</template>

<script setup>
import WalletConnect from '@/components/WalletConnect.vue'
</script>

<style scoped>
.navbar {
  background: #1e293b;
  color: white;
  padding: 1rem 0;
}

.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: #38bdf8;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  flex: 1;
}

.nav-links a {
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: white;
}
</style>
