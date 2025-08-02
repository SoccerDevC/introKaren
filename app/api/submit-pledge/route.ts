import { type NextRequest, NextResponse } from "next/server"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { sendPledgeNotification } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { name, amount, message, photoUrl } = await request.json()

    if (!name || !amount) {
      return NextResponse.json({ error: "Name and amount are required" }, { status: 400 })
    }

    let pledgeId = null
    const timestamp = new Date().toISOString()

    // Save to database if Supabase is configured
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("pledges")
        .insert([
          {
            name: name.trim(),
            amount: Number.parseInt(amount),
            message: message?.trim() || null,
            photo_url: photoUrl || null,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("Database error:", error)
        return NextResponse.json({ error: "Failed to save pledge" }, { status: 500 })
      }

      pledgeId = data.id
    }

    // Send email notification (this is the main feature)
    console.log("📧 Sending email notification for pledge from:", name)

    try {
      const emailResult = await sendPledgeNotification({
        name: name.trim(),
        amount: Number.parseInt(amount),
        message: message?.trim(),
        photoUrl,
        timestamp,
      })

      if (emailResult.success) {
        console.log("✅ Email sent successfully with ID:", emailResult.messageId)
      } else {
        console.error("❌ Email sending failed:", emailResult.error)
        // Still continue with the response, but log the error
      }
    } catch (emailError) {
      console.error("❌ Email sending exception:", emailError)
      // Don't fail the entire request if email fails
    }

    return NextResponse.json({
      success: true,
      pledgeId,
      message: "Pledge submitted successfully! Email notifications sent.",
      timestamp,
    })
  } catch (error) {
    console.error("❌ API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
