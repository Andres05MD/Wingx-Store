"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="w-9 h-9" /> // Placeholder to avoid hydration mismatch
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors relative w-9 h-9 flex items-center justify-center"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <Moon className="h-5 w-5 text-white" />
            ) : (
                <Sun className="h-5 w-5 text-black" />
            )}
        </button>
    )
}
