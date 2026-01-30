import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors'
import type { Config } from 'wagmi'

// Project ID from WalletConnect Cloud / Reown Cloud
// 获取地址: https://cloud.reown.com
export const projectId = "322842d3c04564dba7aaf8476244e673"

export const metadata = {
  name: 'Orbit Arbitration',
  description: 'Optimistic Oracle Arbitration Platform',
  url: 'https://orbit.example.com',
  icons: ['https://orbit.example.com/icon.png']
}

export const config: Config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    walletConnect({
      projectId,
      metadata,
      showQrModal: false // 使用自定义 UI
    }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: metadata.name,
      appLogoUrl: metadata.icons[0]
    })
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http()
  },
  ssr: true
})
