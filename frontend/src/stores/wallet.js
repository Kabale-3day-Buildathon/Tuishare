import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { isConnected, getPublicKey, signTransaction } from '@stellar/freighter-api'

export const useWalletStore = defineStore('wallet', () => {
  const publicKey = ref(null)
  const connected = computed(() => !!publicKey.value)

  async function connect() {
    const walletConnected = await isConnected()
    if (!walletConnected) {
      throw new Error('Freighter wallet extension is not installed.')
    }
    publicKey.value = await getPublicKey()
    return publicKey.value
  }

  function disconnect() {
    publicKey.value = null
  }

  async function sign(xdr) {
    return await signTransaction(xdr, { network: 'TESTNET' })
  }

  return { publicKey, connected, connect, disconnect, sign }
})
