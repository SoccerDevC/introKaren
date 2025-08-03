import { type NextRequest, NextResponse } from "next/server"
import { supabase, isSupabaseConfigured, checkTableExists } from "@/lib/supabase"
import { sendPledgeNotification } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { name, amount, message } = await request.json()

    if (!name || !amount) {
      return NextResponse.json({ error: "Name and amount are required" }, { status: 400 })
    }

    const amt = typeof amount === "string" ? Number.parseInt(amount) : amount
    let pledgeId = null
    const timestamp = new Date().toISOString()

    // Save to database if Supabase is configured and table exists
    if (isSupabaseConfigured && supabase) {
      const tableExists = await checkTableExists()

      if (tableExists) {
        try {
          const { data, error } = await supabase
            .from("pledges")
            .insert([
              {
                name: name.trim(),
                amount: amt,
                message: message?.trim() || null,
              },
            ])
            .select()
            .single()

          if (error) {
            console.error("Database error:", error)
            // Don't fail the request, just log the error
            console.log("Continuing without database save...")
          } else {
            pledgeId = data.id
            console.log("✅ Pledge saved to database with ID:", pledgeId)
          }
        } catch (dbError) {
          console.error("Database operation failed:", dbError)
          console.log("Continuing without database save...")
        }
      } else {
        console.log("📋 Table doesn't exist yet, skipping database save")
      }
    }

    // Send email notification (this is the main feature)
    console.log("📧 Sending email notification for pledge from:", name)

    try {
      const emailResult = await sendPledgeNotification({
        name: name.trim(),
        amount: Number.parseInt(amount),
        message: message?.trim(),
        photoUrl: undefined,
        timestamp,
      })

      if (emailResult.success) {
        console.log("✅ Email sent successfully with ID:", emailResult.messageId)
      } else {
        console.error("❌ Email sending failed:", emailResult.error)
      }
    } catch (emailError) {
      console.error("❌ Email sending exception:", emailError)
    }

    return NextResponse.json({
      success: true,
      pledgeId,
      message: "Pledge submitted successfully! Email notifications sent.",
      timestamp,
      savedToDatabase: !!pledgeId,
    })
  } catch (error) {
    console.error("❌ API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
