'use client'

import { useAccount, useDisconnect, useEnsName } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'

export function useWallet() {
  const { address, isConnected, chain } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { open } = useWeb3Modal()
  const { disconnect, isPending: isDisconnecting } = useDisconnect()

  // Format address to short form: 0xAb...cD12
  const formatAddress = (addr?: string): string => {
    if (!addr || addr.length < 10) return addr || ''
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`
  }

  // 打开 Web3Modal
  const openModal = async () => {
    try {
      await open()
    } catch (error) {
      console.error('Failed to open Web3Modal:', error)
    }
  }

  return {
    address,
    displayAddress: ensName || formatAddress(address),
    isConnected,
    chain,
    isConnecting: false,
    isDisconnecting,
    disconnect,
    openModal
  }
}
