'use client'

import { createWeb3Modal } from '@web3modal/wagmi/react'
import { config, projectId } from './web3-config'
import { useTheme } from '@/components/theme-provider'

// Create Web3Modal instance
const modal = createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: false, // 禁用分析
  themeVariables: {
    '--w3m-z-index': 9999,
    '--w3m-font-family': 'system-ui, sans-serif'
  }
})

// 根据用户主题动态更新 Web3Modal 主题
export function useWeb3ModalTheme() {
  const { theme } = useTheme()

  // 根据主题值转换为 Web3Modal 期望的模式
  const getResolvedTheme = (): 'light' | 'dark' => {
    if (theme === 'light') return 'light'
    if (theme === 'dark') return 'dark'
    // theme === 'system'，根据系统偏好
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // 监听主题变化并更新 Web3Modal
  if (modal) {
    const resolvedTheme = getResolvedTheme()
    modal.setThemeMode?.(resolvedTheme)
  }
}
