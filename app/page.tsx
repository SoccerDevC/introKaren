"use client"

import { useState } from "react"
import { PledgeForm } from "@/components/pledge-form"
import { PledgeWall } from "@/components/pledge-wall"
import { FloatingHearts, PledgeAnimation, MilestoneAnimation } from "@/components/animations"
import { isSupabaseConfigured } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [showPledgeAnimation, setShowPledgeAnimation] = useState(false)
  const [lastPledgeAmount, setLastPledgeAmount] = useState(0)
  const [showMilestone, setShowMilestone] = useState(false)
  const [milestoneAmount, setMilestoneAmount] = useState(0)
  const [totalPledged, setTotalPledged] = useState(0)
  const [emailStatus, setEmailStatus] = useState<"testing" | "success" | "error" | null>(null)

  const testEmailSystem = async () => {
    setEmailStatus("testing")
    try {
      const response = await fetch("/api/test-email")
      const result = await response.json()

      if (result.success) {
        setEmailStatus("success")
        setTimeout(() => setEmailStatus(null), 5000)
      } else {
        setEmailStatus("error")
        setTimeout(() => setEmailStatus(null), 8000)
      }
    } catch (error) {
      console.error("Email test failed:", error)
      setEmailStatus("error")
      setTimeout(() => setEmailStatus(null), 8000)
    }
  }

  const handlePledgeSubmitted = (amount: number) => {
    setLastPledgeAmount(amount)
    setShowPledgeAnimation(true)

    const newTotal = totalPledged + amount
    setTotalPledged(newTotal)

    const milestones = [100000, 500000, 1000000, 2000000, 5000000]
    const reachedMilestone = milestones.find((milestone) => totalPledged < milestone && newTotal >= milestone)

    if (reachedMilestone) {
      setTimeout(() => {
        setMilestoneAmount(reachedMilestone)
        setShowMilestone(true)
      }, 3500)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white">
      <FloatingHearts />

      {/* Header */}
      <header className="text-center py-8 px-4">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-4">
          💖 Karen's Introduction Ceremony 💖
        </h1>
        <p className="text-xl text-rose-600 max-w-2xl mx-auto">
          Join us in celebrating love and making this special day unforgettable. Every pledge adds a flower to our
          garden of love! 🌸
        </p>
      </header>

      {/* Email Status Banner */}
      {emailStatus && (
        <div
          className={`py-3 px-4 text-center text-white ${
            emailStatus === "testing" ? "bg-blue-500" : emailStatus === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {emailStatus === "testing" && "📧 Testing email system..."}
          {emailStatus === "success" && "✅ Email system working! Test email sent to both addresses."}
          {emailStatus === "error" && "❌ Email test failed. Please check configuration."}
        </div>
      )}

      {/* Configuration Banner */}
      {!isSupabaseConfigured ? (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 text-center">
          <p className="text-sm">
            🚀 <strong>Ready to go live?</strong> Add Supabase integration above to enable real-time pledges and
            database storage!
          </p>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-4 text-center flex items-center justify-center gap-4">
          <p className="text-sm">
            ✅ <strong>System Active!</strong> Real-time pledges and email notifications are enabled.
          </p>
          <Button
            onClick={testEmailSystem}
            disabled={emailStatus === "testing"}
            size="sm"
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            📧 Test Email
          </Button>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="order-2 lg:order-1">
            <PledgeForm onPledgeSubmitted={handlePledgeSubmitted} />
          </div>
          <div className="order-1 lg:order-2">
            <PledgeWall />
          </div>
        </div>
      </main>

      {/* Animations */}
      {showPledgeAnimation && (
        <PledgeAnimation amount={lastPledgeAmount} onComplete={() => setShowPledgeAnimation(false)} />
      )}

      {showMilestone && <MilestoneAnimation milestone={milestoneAmount} />}
    </div>
  )
}
