"use client"

import { useState, useEffect } from "react"

export function KarenHero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-rose-300/30 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-pink-300/30 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-300/30 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-32 right-10 w-12 h-12 bg-rose-400/30 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Floating Hearts */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className="absolute text-rose-300/40 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
              fontSize: `${1 + Math.random() * 1.5}rem`,
            }}
          >
            💖
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Karen's Photo */}
          <div
            className={`relative transform transition-all duration-2000 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
          >
            <div className="relative">
              {/* Glowing Border Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 rounded-3xl blur-lg opacity-75 animate-pulse"></div>

              {/* Main Photo Container */}
              <div className="relative bg-white p-2 rounded-3xl shadow-2xl">
                <img
                  src="/images/karen.jpg"
                  alt="Beautiful Karen in her stunning rose gold dress"
                  className="w-full h-auto rounded-2xl shadow-xl"
                />

                {/* Sparkle Effects */}
                <div className="absolute top-4 right-4 text-2xl animate-ping">✨</div>
                <div className="absolute bottom-4 left-4 text-2xl animate-ping delay-1000">🌟</div>
                <div className="absolute top-1/2 left-2 text-xl animate-ping delay-2000">💫</div>
              </div>

              {/* Floating Elements Around Photo */}
              <div className="absolute -top-6 -right-6 text-4xl animate-bounce">👑</div>
              <div className="absolute -bottom-4 -left-4 text-3xl animate-bounce delay-500">🌹</div>
            </div>
          </div>

          {/* Text Content */}
          <div
            className={`text-center lg:text-left transform transition-all duration-2000 delay-500 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
          >
            <div className="space-y-6">
              {/* Main Title */}
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="block bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                  Karen's
                </span>
                <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent animate-gradient delay-500">
                  Introduction
                </span>
                <span className="block bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent animate-gradient delay-1000">
                  Ceremony
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-rose-700 font-medium leading-relaxed">
                A celebration of love, beauty, and new beginnings ✨
              </p>

              {/* Description */}
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                Join us in celebrating this radiant queen as she embarks on a beautiful journey. Every pledge is a
                flower in the garden of love we're creating for her special day! 🌸💖
              </p>

              {/* Decorative Elements */}
              <div className="flex justify-center lg:justify-start items-center gap-4 text-3xl">
                <span className="animate-bounce">🌹</span>
                <span className="animate-bounce delay-200">💖</span>
                <span className="animate-bounce delay-400">✨</span>
                <span className="animate-bounce delay-600">🌸</span>
                <span className="animate-bounce delay-800">💕</span>
              </div>

              {/* Call to Action */}
              <div className="pt-4">
                <p className="text-rose-600 font-semibold text-lg animate-pulse">
                  Scroll down to make your pledge of love! 👇
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  )
}
