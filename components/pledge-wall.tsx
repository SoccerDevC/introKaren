"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { supabase, isSupabaseConfigured, mockPledges, type Pledge } from "@/lib/supabase"

export function PledgeWall() {
  const [pledges, setPledges] = useState<Pledge[]>([])
  const [newPledgeId, setNewPledgeId] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setPledges(mockPledges)
      return
    }

    const fetchPledges = async () => {
      const { data, error } = await supabase.from("pledges").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching pledges:", error)
        return
      }

      setPledges(data || [])
    }

    fetchPledges()

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
      supabase.removeChannel(channel)
    }
  }, [])

  const totalAmount = pledges.reduce((sum, pledge) => sum + pledge.amount, 0)

  const getBadge = (amount: number) => {
    if (amount >= 200000) return "💖"
    if (amount >= 100000) return "💐"
    if (amount >= 50000) return "🌹"
    return "🌸"
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="mb-6 bg-gradient-to-r from-rose-100 to-pink-100 border-rose-200">
        <CardContent className="p-6 text-center">
          <h2 className="text-3xl font-bold text-rose-700 mb-2">Total Pledged</h2>
          <p className="text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            UGX {totalAmount.toLocaleString()}
          </p>
          <p className="text-rose-600 mt-2">{pledges.length} loving supporters</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pledges.map((pledge) => (
          <Card
            key={pledge.id}
            className={`transform transition-all duration-1000 ${
              newPledgeId === pledge.id
                ? "animate-slide-up bg-gradient-to-br from-rose-100 to-pink-100 border-rose-300 shadow-xl scale-105"
                : "bg-white border-rose-200 hover:shadow-lg hover:scale-102"
            }`}
          >
            <CardContent className="p-4">
              {pledge.photo_url && (
                <div className="mb-3">
                  <img
                    src={pledge.photo_url || "/placeholder.svg"}
                    alt={`Photo from ${pledge.name}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-rose-700 flex items-center gap-2">
                  {getBadge(pledge.amount)} {pledge.name}
                </h3>
                <span className="text-lg font-bold text-pink-600">{pledge.amount.toLocaleString()}</span>
              </div>
              {pledge.message && <p className="text-gray-600 text-sm italic">"{pledge.message}"</p>}
              <p className="text-xs text-gray-400 mt-2">{new Date(pledge.created_at).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {pledges.length === 0 && (
        <Card className="bg-rose-50 border-rose-200">
          <CardContent className="p-8 text-center">
            <p className="text-rose-600 text-lg">🌸 Be the first to pledge your love! 🌸</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
