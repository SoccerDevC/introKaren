"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { isSupabaseConfigured, uploadFile } from "@/lib/supabase"
import { Camera, X, Upload } from "lucide-react"

interface PledgeFormProps {
  onPledgeSubmitted: (amount: number) => void
}

export function PledgeForm({ onPledgeSubmitted }: PledgeFormProps) {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const quickAmounts = [25000, 50000, 100000, 200000]

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }

      setSelectedFile(file)

      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !amount) return

    setIsSubmitting(true)

    try {
      let photoUrl = null

      // Upload photo if selected
      if (selectedFile && isSupabaseConfigured) {
        setUploadProgress(true)
        photoUrl = await uploadFile(selectedFile)
        setUploadProgress(false)
      }

      // Submit pledge via API route
      const response = await fetch("/api/submit-pledge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          amount: Number.parseInt(amount),
          message: message.trim() || null,
          photoUrl,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit pledge")
      }

      const result = await response.json()

      if (result.success) {
        onPledgeSubmitted(Number.parseInt(amount))

        // Reset form
        setName("")
        setAmount("")
        setMessage("")
        removeFile()
      } else {
        throw new Error(result.error || "Failed to submit pledge")
      }
    } catch (error) {
      console.error("Error submitting pledge:", error)
      alert("Failed to submit pledge. Please try again.")
    } finally {
      setIsSubmitting(false)
      setUploadProgress(false)
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-xl">
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
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
          >
            🎭 Try Demo Pledge
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
          💖 Pledge Your Love 💖
        </CardTitle>
        <p className="text-rose-600">Help make Karen's day magical</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-rose-700 font-medium">
              Your Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="border-rose-200 focus:border-rose-400"
              required
            />
          </div>

          <div>
            <Label htmlFor="amount" className="text-rose-700 font-medium">
              Pledge Amount (UGX)
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="border-rose-200 focus:border-rose-400"
              required
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="border-rose-300 text-rose-600 hover:bg-rose-100"
                >
                  {quickAmount.toLocaleString()}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="message" className="text-rose-700 font-medium">
              Message (Optional)
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your wishes for Karen..."
              className="border-rose-200 focus:border-rose-400 resize-none"
              rows={3}
            />
          </div>

          {/* Photo Upload Section */}
          <div>
            <Label className="text-rose-700 font-medium flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Add a Photo (Optional)
            </Label>

            {!previewUrl ? (
              <div className="mt-2">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-rose-300 text-rose-600 hover:bg-rose-100 flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Choose Photo
                </Button>
                <p className="text-xs text-gray-500 mt-1">Max 5MB, JPG/PNG only</p>
              </div>
            ) : (
              <div className="mt-2 relative">
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg border-2 border-rose-200"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeFile}
                  className="absolute top-2 right-2 w-6 h-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !name || !amount}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold py-3 rounded-lg shadow-lg transform transition hover:scale-105"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {uploadProgress ? "Uploading photo..." : "Submitting..."}
              </span>
            ) : (
              "💕 Submit Pledge 💕"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
