import { NextResponse } from "next/server"
import { testEmailConfiguration, sendPledgeNotification } from "@/lib/email"

export async function GET() {
  try {
    // Test email configuration
    const configTest = await testEmailConfiguration()

    if (!configTest.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Email configuration failed",
          details: configTest.error,
        },
        { status: 500 },
      )
    }

    // Send a test email
    const testEmailResult = await sendPledgeNotification({
      name: "Test User",
      amount: 50000,
      message: "This is a test email to verify the system is working correctly! 🎉",
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: "Email configuration is working!",
      emailSent: testEmailResult.success,
      messageId: testEmailResult.messageId,
    })
  } catch (error) {
    console.error("Test email error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Test failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
