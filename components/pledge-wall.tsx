"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase, isSupabaseConfigured, mockPledges, checkTableExists, type Pledge } from "@/lib/supabase"

export function PledgeWall() {
  const [pledges, setPledges] = useState<Pledge[]>([])
  const [newPledgeId, setNewPledgeId] = useState<string | null>(null)
  const [tableExists, setTableExists] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializePledgeWall = async () => {
      setIsLoading(true)

      if (!isSupabaseConfigured || !supabase) {
        setPledges(mockPledges)
        setTableExists(false)
        setIsLoading(false)
        return
      }

      // Check if table exists
      const exists = await checkTableExists()
      setTableExists(exists)

      if (!exists) {
        console.log("📋 Pledges table does not exist yet. Using mock data.")
        setPledges(mockPledges)
        setIsLoading(false)
        return
      }

      // Fetch real pledges
      try {
        const { data, error } = await supabase.from("pledges").select("*").order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching pledges:", error)
          setPledges(mockPledges)
        } else {
          setPledges(data || mockPledges)
        }
      } catch (error) {
        console.error("Error fetching pledges:", error)
        setPledges(mockPledges)
      }

      setIsLoading(false)
    }

    initializePledgeWall()

    // Set up real-time subscription only if table exists
    if (isSupabaseConfigured && supabase && tableExists) {
      const channel = supabase
        .channel("pledges")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "pledges" }, (payload) => {
          const newPledge = payload.new as Pledge
          setPledges((current) => [newPledge, ...current])
          setNewPledgeId(newPledge.id)

          setTimeout(() => setNewPledgeId(null), 3000)
        })
        .subscribe()

      return () => {
        if (supabase) {
          supabase.removeChannel(channel)
        }
      }
    }
  }, [tableExists])

  const totalAmount = pledges.reduce((sum, pledge) => sum + pledge.amount, 0)

  const getBadge = (amount: number) => {
    if (amount >= 500000) return "👑"
    if (amount >= 200000) return "💖"
    if (amount >= 100000) return "💐"
    if (amount >= 50000) return "🌹"
    return "🌸"
  }

  const getTitle = (amount: number) => {
    if (amount >= 500000) return "Royal Supporter"
    if (amount >= 200000) return "Love Champion"
    if (amount >= 100000) return "Generous Heart"
    if (amount >= 50000) return "Beautiful Soul"
    return "Sweet Supporter"
  }

  const runDatabaseSetup = async () => {
    alert(
      "📋 Please run the database setup script in your Supabase SQL editor. Check the scripts/setup-database-v2.sql file!",
    )
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="mb-8 bg-gradient-to-r from-rose-100 to-pink-100 border-rose-200">
          <CardContent className="p-8 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-rose-200 rounded mb-4"></div>
              <div className="h-12 bg-rose-300 rounded mb-2"></div>
              <div className="h-6 bg-rose-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Database Setup Warning */}
      {isSupabaseConfigured && tableExists === false && (
        <Card className="mb-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">⚠️</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-amber-700 mb-2">Database Setup Required</h3>
                <p className="text-amber-600 mb-4">
                  Supabase is configured, but the pledges table doesn't exist yet. Please run the database setup script
                  to enable real-time pledges.
                </p>
                <Button onClick={runDatabaseSetup} className="bg-amber-500 hover:bg-amber-600 text-white">
                  📋 View Setup Instructions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Total Display */}
      <Card className="mb-8 bg-gradient-to-r from-rose-100 to-pink-100 border-rose-200 shadow-xl">
        <CardContent className="p-8 text-center">
          <h2 className="text-4xl font-bold text-rose-700 mb-4">💖 Wall of Love 💖</h2>
          <div className="space-y-2">
            <p className="text-6xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              UGX {totalAmount.toLocaleString()}
            </p>
            <p className="text-rose-600 text-xl font-semibold">{pledges.length} loving supporters</p>
            {!isSupabaseConfigured && (
              <p className="text-sm text-rose-500 italic">Demo data - Configure Supabase for real pledges</p>
            )}
            {isSupabaseConfigured && tableExists === false && (
              <p className="text-sm text-amber-600 italic">Demo data - Run database setup for real pledges</p>
            )}
            <div className="flex justify-center items-center gap-2 text-2xl mt-4">
              <span>🌹</span>
              <span>💖</span>
              <span>✨</span>
              <span>🌸</span>
              <span>💕</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pledges Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pledges.map((pledge) => (
          <Card
            key={pledge.id}
            className={`transform transition-all duration-1000 ${
              newPledgeId === pledge.id
                ? "animate-slide-up bg-gradient-to-br from-rose-100 to-pink-100 border-rose-300 shadow-xl scale-105"
                : "bg-white/90 border-rose-200 hover:shadow-lg hover:scale-102 backdrop-blur-sm"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getBadge(pledge.amount)}</span>
                  <div>
                    <h3 className="font-bold text-rose-700 text-lg">{pledge.name}</h3>
                    <p className="text-sm text-rose-500 font-medium">{getTitle(pledge.amount)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-pink-600">{pledge.amount.toLocaleString()}</span>
                  <p className="text-xs text-gray-500">UGX</p>
                </div>
              </div>

              {pledge.message && (
                <div className="bg-rose-50 p-4 rounded-lg border-l-4 border-rose-300 mb-4">
                  <p className="text-gray-700 text-sm italic leading-relaxed">"{pledge.message}"</p>
                </div>
              )}

              <div className="flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-rose-100">
                <span>💕 With love</span>
                <span>{new Date(pledge.created_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pledges.length === 0 && (
        <Card className="bg-rose-50 border-rose-200 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="text-6xl">🌸</div>
              <h3 className="text-2xl font-bold text-rose-600">Be the First to Pledge!</h3>
              <p className="text-rose-500 text-lg">Start the celebration of love for Karen's special day!</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Pledges Section */}
      <div className="mt-12">
        <h3 className="font-bold text-xl mb-2">Top Pledges</h3>
        <ul>
          {pledges.slice(0, 10).map((p, i) => (
            <li key={i}>
              <span className="font-semibold">{p.name}</span>: ₦{p.amount.toLocaleString()}{" "}
              {p.message && <span>— {p.message}</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
