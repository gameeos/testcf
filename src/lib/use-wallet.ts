'use client'

import { useConnection, useDisconnect, useEnsName, useSignMessage } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'

export function useWallet() {
  const { address, isConnected, chain } = useConnection()
  const { data: ensName } = useEnsName({ address })
  const { open } = useWeb3Modal()
  const { mutate, isPending: isDisconnecting } = useDisconnect()

  // 添加签名消息 hook
  const { mutateAsync } = useSignMessage()

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

  // 签名消息方法
  const signMessage = async (message: string): Promise<string | null> => {
    if (!isConnected || !address) {
      console.error('Wallet not connected')
      return null
    }

    try {
      const signature = await mutateAsync({ message })
      return signature
    } catch (error) {
      console.error('Failed to sign message:', error)
      return null
    }
  }

  return {
    address,
    displayAddress: ensName || formatAddress(address),
    isConnected,
    chain,
    isConnecting: false,
    isDisconnecting,
    disconnect: () => mutate(),
    openModal,
    signMessage
  }
}
