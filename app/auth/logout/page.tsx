"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const handleLogout = async () => {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/")
      router.refresh()
    }

    handleLogout()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-rose-200 border-t-rose-600" />
        <p className="mt-4 text-foreground/60">Logging out...</p>
      </div>
    </div>
  )
}
