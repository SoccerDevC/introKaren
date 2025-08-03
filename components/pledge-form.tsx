"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface PledgeFormProps {
  onPledgeSubmitted: (amount: number) => void
}

export function PledgeForm({ onPledgeSubmitted }: PledgeFormProps) {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState(0)
  const [customAmount, setCustomAmount] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const presetAmounts = [20000, 50000, 100000, 200000]

  const addAmount = (amt: number) => setAmount((a) => a + amt)
  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value)
    setAmount(Number(e.target.value) || 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
          amount: Number.parseInt(amount.toString()),
          message: message.trim() || null,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit pledge")
      }

      if (result.success) {
        onPledgeSubmitted(Number.parseInt(amount.toString()))

        // Reset form
        setName("")
        setAmount(0)
        setCustomAmount("")
        setMessage("")

        // Show success message
        alert("🎉 Pledge submitted successfully! Thank you for your love and support! 💖")
      } else {
        throw new Error(result.error || "Failed to submit pledge")
      }
    } catch (error) {
      console.error("Error submitting pledge:", error)
      const errorMessage =
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : String(error)
      alert(`❌ Failed to submit pledge: ${errorMessage}. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
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
        <form onSubmit={handleSubmit} className="space-y-6" id="pledge-form">
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
            <div className="flex flex-wrap gap-2 mb-2">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  className="flex-1 min-w-[45%] sm:min-w-[120px] bg-pink-100 px-3 py-2 rounded font-semibold text-pink-700 hover:bg-pink-200 transition"
                  onClick={() => addAmount(amt)}
                >
                  +UGX{amt.toLocaleString()}
                </button>
              ))}
            </div>
            <Input
              id="amount"
              type="number"
              min={0}
              placeholder="Or type amount"
              value={customAmount}
              onChange={handleCustomAmount}
              className="border-rose-200 focus:border-rose-400 bg-white/80 backdrop-blur-sm h-12 text-lg"
            />
            <div className="mt-2 font-bold text-lg">Total: UGX{amount.toLocaleString()}</div>
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
            disabled={isSubmitting || !name || amount <= 0}
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

export default function Page() {
  const handlePledgeSubmitted = (amount: number) => {
    console.log("Pledge submitted:", amount)
    // Handle the pledge submitted event (e.g., show a thank you message, update UI, etc.)
  }

  return (
    <div id="pledge-form">
      <PledgeForm onPledgeSubmitted={handlePledgeSubmitted} />
    </div>
  )
}
