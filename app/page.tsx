"use client"

import { useState } from "react"
import { PledgeForm } from "@/components/pledge-form"
import { PledgeWall } from "@/components/pledge-wall"
import { KarenHero } from "@/components/karen-hero"
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

      {/* Hero Section with Karen's Photo */}
      <KarenHero />

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
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-4 text-center">
          <p className="text-sm">
            🚀 <strong>Ready to go live?</strong> Add Supabase integration above to enable real-time pledges and
            database storage!
          </p>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-4 px-4 text-center flex items-center justify-center gap-4">
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

      {/* Main Content Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Make Your Pledge of Love
            </h2>
            <p className="text-xl text-rose-600 max-w-3xl mx-auto leading-relaxed">
              Every contribution is a blessing, every pledge is a prayer, and every supporter becomes part of Karen's
              beautiful story. Join the celebration! 🌸💖
            </p>
          </div>

          {/* Pledge Form and Wall */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="order-2 lg:order-1">
              <PledgeForm onPledgeSubmitted={handlePledgeSubmitted} />
            </div>
            <div className="order-1 lg:order-2">
              <PledgeWall />
            </div>
          </div>
        </div>
      </section>

      {/* Animations */}
      {showPledgeAnimation && (
        <PledgeAnimation amount={lastPledgeAmount} onComplete={() => setShowPledgeAnimation(false)} />
      )}

      {showMilestone && <MilestoneAnimation milestone={milestoneAmount} />}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-rose-100 to-pink-100 py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-rose-700">With Love & Blessings</h3>
            <p className="text-rose-600 max-w-2xl mx-auto">
              Thank you for being part of Karen's special journey. Your love and support make this celebration truly
              magical! ✨
            </p>
            <div className="flex justify-center items-center gap-4 text-2xl">
              <span>🌹</span>
              <span>💖</span>
              <span>✨</span>
              <span>🌸</span>
              <span>💕</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
