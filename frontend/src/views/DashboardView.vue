<template>
  <div class="dashboard">
    <h1>Dashboard</h1>

    <div v-if="!wallet.connected" class="connect-prompt">
      <p>Connect your Freighter wallet to view your dashboard.</p>
      <button @click="wallet.connect" class="btn-connect">Connect Wallet</button>
    </div>

    <div v-else>
      <p class="wallet-addr">Wallet: <code>{{ wallet.publicKey }}</code></p>

      <div class="tabs">
        <button :class="{ active: tab === 'sponsored' }" @click="tab = 'sponsored'">My Sponsorships</button>
        <button :class="{ active: tab === 'transactions' }" @click="tab = 'transactions'">Transactions</button>
      </div>

      <div v-if="tab === 'sponsored'" class="panel">
        <p v-if="sponsorships.length === 0" class="empty">No sponsorships yet.</p>
        <div v-for="s in sponsorships" :key="s.id" class="item">
          <strong>{{ s.studentName }}</strong> — {{ s.purpose }}
          <span class="amount">${{ s.amount }} USDC</span>
          <span class="status" :class="s.status">{{ s.status }}</span>
        </div>
      </div>

      <div v-if="tab === 'transactions'" class="panel">
        <p v-if="transactions.length === 0" class="empty">No transactions yet.</p>
        <div v-for="tx in transactions" :key="tx.hash" class="item">
          <a :href="`https://stellar.expert/explorer/testnet/tx/${tx.hash}`" target="_blank" rel="noopener">
            {{ tx.hash.slice(0, 12) }}...
          </a>
          <span class="amount">${{ tx.amount }} USDC</span>
          <span class="date">{{ tx.date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useWalletStore } from '@/stores/wallet'
import axios from 'axios'

const wallet = useWalletStore()
const tab = ref('sponsored')
const sponsorships = ref([])
const transactions = ref([])

onMounted(async () => {
  if (!wallet.connected) return
  try {
    const [spRes, txRes] = await Promise.all([
      axios.get(`/api/sponsors/${wallet.publicKey}/sponsorships`),
      axios.get(`/api/sponsors/${wallet.publicKey}/transactions`)
    ])
    sponsorships.value = spRes.data
    transactions.value = txRes.data
  } catch {
    // silently fail — empty state handles it
  }
})
</script>

<style scoped>
h1 { font-size: 2rem; margin-bottom: 1.5rem; }

.connect-prompt {
  text-align: center;
  padding: 4rem;
  background: white;
  border-radius: 12px;
}

.btn-connect {
  margin-top: 1rem;
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.wallet-addr { color: #64748b; margin-bottom: 1.5rem; font-size: 0.85rem; }
.wallet-addr code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; }

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tabs button {
  padding: 0.6rem 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-weight: 500;
}

.tabs button.active {
  border-color: #0ea5e9;
  color: #0ea5e9;
}

.panel {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.item:last-child { border-bottom: none; }

.amount { margin-left: auto; font-weight: 600; }

.status { padding: 2px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 600; }
.status.pending { background: #fef3c7; color: #92400e; }
.status.completed { background: #d1fae5; color: #065f46; }

.date { color: #94a3b8; font-size: 0.85rem; }
.empty { color: #94a3b8; text-align: center; padding: 2rem; }
</style>
