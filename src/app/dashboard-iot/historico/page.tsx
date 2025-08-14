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
                    src={`http://172.16.93.83:7000/dashboards/f/deu1p0sybyxa8d/?orgId=1&kiosk&theme=${grafanaTheme}`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                />
            </div>

        )
    }

    return (
        <div className="grid w-full h-screen">
            <GrafanaPanel></GrafanaPanel>
        </div>
    )
}