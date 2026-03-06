<template>
  <div class="wallet-connect">
    <button v-if="!wallet.connected" @click="handleConnect" class="btn-connect">
      Connect Wallet
    </button>
    <div v-else class="wallet-info">
      <span class="address">{{ shortAddress }}</span>
      <button @click="wallet.disconnect" class="btn-disconnect">Disconnect</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useWalletStore } from '@/stores/wallet'

const wallet = useWalletStore()

const shortAddress = computed(() => {
  if (!wallet.publicKey) return ''
  return `${wallet.publicKey.slice(0, 6)}...${wallet.publicKey.slice(-4)}`
})

async function handleConnect() {
  try {
    await wallet.connect()
  } catch (err) {
    alert(err.message)
  }
}
</script>

<style scoped>
.btn-connect {
  background: #38bdf8;
  color: #0f172a;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-connect:hover {
  background: #7dd3fc;
}

.wallet-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.address {
  font-family: monospace;
  color: #94a3b8;
  font-size: 0.85rem;
}

.btn-disconnect {
  background: transparent;
  color: #94a3b8;
  border: 1px solid #334155;
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.btn-disconnect:hover {
  color: #f87171;
  border-color: #f87171;
}
</style>
