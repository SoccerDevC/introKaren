"use client"

import { useState } from "react"
import { PledgeForm } from "@/components/pledge-form"
import { PledgeWall } from "@/components/pledge-wall"
import { KarenHero } from "@/components/karen-hero"
import { FloatingHearts, PledgeAnimation, MilestoneAnimation } from "@/components/animations"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [showPledgeAnimation, setShowPledgeAnimation] = useState(false)
  const [lastPledgeAmount, setLastPledgeAmount] = useState(0)
  const [showMilestone, setShowMilestone] = useState(false)
  const [milestoneAmount, setMilestoneAmount] = useState(0)
  const [totalPledged, setTotalPledged] = useState(0)
  const [emailStatus, setEmailStatus] = useState<"testing" | "success" | "error" | null>(null)

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
        // Hide milestone after 4 seconds
        setTimeout(() => setShowMilestone(false), 4000)
      }, 3500)
    }
  }

  const testEmailSystem = async () => {
    setEmailStatus("testing")

    // Simulate an API call to test the email system
    setTimeout(() => {
      // Randomly succeed or fail the email test
      Math.random() > 0.5 ? setEmailStatus("success") : setEmailStatus("error")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white">
      <FloatingHearts />

      {/* Hero Section with Karen's Photo */}
      <KarenHero />

      {/* Centered Pledge Now Button below the hero image */}
      <div className="flex justify-center mt-6 mb-2">
<Button
  size="lg"
  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-8 py-3 rounded-full shadow-lg transition"
  onClick={() => {
    document.getElementById('pledge-form')?.scrollIntoView({ behavior: 'smooth' });
  }}
>
  Pledge Now
</Button>
      </div>
      
      {/* Configuration Banner */}
      {false ? (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-4 text-center">
          <p className="text-sm">
            🚀 <strong>Ready to go live?</strong> Add Supabase integration above to enable real-time pledges and
            database storage!
          </p>
        </div>
      ) : null}

      {/* Main Content Section */}
      <section className="py-10 px-2 sm:py-16 sm:px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Make Your Pledge of Love
            </h2>
            <p className="text-lg sm:text-xl text-rose-600 max-w-3xl mx-auto leading-relaxed">
              Every contribution is a blessing, every pledge is a prayer, and every supporter becomes part of Karen's
              beautiful story. Join the celebration! 🌸💖
            </p>
          </div>

          {/* Pledge Form and Wall */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
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
