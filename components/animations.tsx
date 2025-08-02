"use client"

import { useEffect, useState } from "react"

export function FloatingHearts() {
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; delay: number }>>([])

  useEffect(() => {
    const newHearts = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
    }))
    setHearts(newHearts)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute text-2xl animate-float opacity-20"
          style={{
            left: `${heart.x}%`,
            animationDelay: `${heart.delay}s`,
            animationDuration: "8s",
          }}
        >
          💖
        </div>
      ))}
    </div>
  )
}

export function PledgeAnimation({ amount, onComplete }: { amount: number; onComplete: () => void }) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
      onComplete()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onComplete])

  if (!show) return null

  const isSpecialAmount = amount >= 50000

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="animate-celebration">
        {isSpecialAmount && (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl animate-bounce">🌸</div>
            </div>
            <div className="absolute top-1/4 left-1/4 text-4xl animate-pulse delay-300">💐</div>
            <div className="absolute top-1/3 right-1/4 text-4xl animate-pulse delay-500">✨</div>
            <div className="absolute bottom-1/3 left-1/3 text-4xl animate-pulse delay-700">💕</div>
            <div className="absolute bottom-1/4 right-1/3 text-4xl animate-pulse delay-1000">🌹</div>
          </>
        )}
        <div className="bg-gradient-to-r from-rose-400 to-pink-400 text-white px-8 py-4 rounded-full shadow-2xl animate-scale-in">
          <p className="text-2xl font-bold">Thank you! 💖</p>
          <p className="text-lg">UGX {amount.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}

export function MilestoneAnimation({ milestone }: { milestone: number }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
      <div className="animate-milestone">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-12 py-6 rounded-full shadow-2xl">
          <p className="text-3xl font-bold">🎉 Milestone Reached! 🎉</p>
          <p className="text-xl text-center">UGX {milestone.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
