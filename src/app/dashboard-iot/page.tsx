'use client'

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Page() {
  const GrafanaPanel = () => {
    const { theme, systemTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    const currentTheme = theme === "system" ? systemTheme : theme
    const grafanaTheme = currentTheme === "dark" ? "dark" : "light"

    return (
      <div>
        <iframe
          src={`http://172.16.93.83:7000/d/fezykvalfirr4d/resumen?orgId=1&timezone=browser&panelId=2&__feature.dashboardSceneSolo=1&kiosk=1&theme=${grafanaTheme}`}
          className="roudend-lg flex w-full h-full"
        >
        </iframe>
      </div>

    )
  }

  return (
    <div className="grid w-full h-screen">
      <GrafanaPanel></GrafanaPanel>
    </div>
  )
}