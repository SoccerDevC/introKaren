"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { isSupabaseConfigured } from "@/lib/supabase"

interface PledgeFormProps {
  onPledgeSubmitted: (amount: number) => void
}

export function PledgeForm({ onPledgeSubmitted }: PledgeFormProps) {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const quickAmounts = [25000, 50000, 100000, 200000, 500000]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !amount) return

    setIsSubmitting(true)

    try {
      // Submit pledge via API route - simplified payload
      const response = await fetch("/api/submit-pledge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          amount: Number.parseInt(amount),
          message: message.trim() || null,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit pledge")
      }

      if (result.success) {
        onPledgeSubmitted(Number.parseInt(amount))

        // Reset form
        setName("")
        setAmount("")
        setMessage("")

        // Show success message
        alert("🎉 Pledge submitted successfully! Thank you for your love and support! 💖")
      } else {
        throw new Error(result.error || "Failed to submit pledge")
      }
    } catch (error) {
      console.error("Error submitting pledge:", error)
      alert(`❌ Failed to submit pledge: ${error.message}. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-xl backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-yellow-700">⚙️ Setup Required</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-yellow-600">
            To enable real-time pledges and email notifications, please configure Supabase by clicking the "Add Supabase
            integration" button above.
          </p>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <p className="text-sm text-yellow-700">
              <strong>Demo Mode:</strong> You can still test the interface - pledges will show mock animations but won't
              be saved or emailed.
            </p>
          </div>
          <Button
            onClick={() => {
              onPledgeSubmitted(50000)
            }}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white transform hover:scale-105 transition-all duration-300"
          >
            🎭 Try Demo Pledge
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-rose-50/90 to-pink-50/90 border-rose-200 shadow-2xl backdrop-blur-sm border-2">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
          💖 Pledge Your Love 💖
        </CardTitle>
        <p className="text-rose-600 font-medium">Help make Karen's day magical</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-rose-700 font-semibold flex items-center gap-2">
              <span className="text-lg">👤</span> Your Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your beautiful name"
              className="border-rose-200 focus:border-rose-400 bg-white/80 backdrop-blur-sm h-12 text-lg"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="amount" className="text-rose-700 font-semibold flex items-center gap-2">
              <span className="text-lg">💰</span> Pledge Amount (UGX)
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter your generous amount"
              className="border-rose-200 focus:border-rose-400 bg-white/80 backdrop-blur-sm h-12 text-lg"
              required
              min="1000"
            />
            <div className="grid grid-cols-2 gap-2 mt-3">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="border-rose-300 text-rose-600 hover:bg-rose-100 hover:border-rose-400 transition-all duration-300 transform hover:scale-105 font-semibold"
                >
                  {quickAmount.toLocaleString()}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-rose-700 font-semibold flex items-center gap-2">
              <span className="text-lg">💌</span> Message (Optional)
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your heartfelt wishes for Karen's special day..."
              className="border-rose-200 focus:border-rose-400 resize-none bg-white/80 backdrop-blur-sm min-h-[100px]"
              rows={4}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !name || !amount}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold py-4 text-lg rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:transform-none"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting your love...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="text-xl">💕</span>
                Submit Pledge of Love
                <span className="text-xl">💕</span>
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
