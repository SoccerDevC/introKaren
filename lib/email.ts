import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "cddavid2001@gmail.com",
    pass: "wdjw thhl jaog hzge",
  },
})

export interface PledgeEmailData {
  name: string
  amount: number
  message?: string
  photoUrl?: string
  timestamp: string
}

export async function sendPledgeNotification(pledgeData: PledgeEmailData) {
  const { name, amount, message, photoUrl, timestamp } = pledgeData

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0; 
          padding: 0; 
          background-color: #f5f5f5;
        }
        .container { 
          max-width: 600px; 
          margin: 20px auto; 
          background: white; 
          border-radius: 15px; 
          overflow: hidden; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .header h1 { 
          margin: 0; 
          font-size: 28px; 
          font-weight: bold; 
        }
        .header p { 
          margin: 10px 0 0 0; 
          font-size: 16px; 
          opacity: 0.9; 
        }
        .content { 
          padding: 30px; 
        }
        .pledge-card { 
          background: linear-gradient(135deg, #ffeef8 0%, #fff0f5 100%); 
          padding: 25px; 
          border-radius: 12px; 
          margin: 20px 0; 
          border-left: 5px solid #ff6b9d;
        }
        .pledge-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }
        .pledger-name { 
          font-size: 20px; 
          font-weight: bold; 
          color: #c44569; 
          margin: 0;
        }
        .amount { 
          font-size: 24px; 
          font-weight: bold; 
          color: #ff6b9d; 
          background: white;
          padding: 8px 16px;
          border-radius: 25px;
          box-shadow: 0 2px 10px rgba(255, 107, 157, 0.2);
        }
        .message-section {
          margin: 15px 0;
          padding: 15px;
          background: white;
          border-radius: 8px;
          border-left: 3px solid #ff6b9d;
        }
        .message-text {
          font-style: italic;
          color: #555;
          font-size: 16px;
          line-height: 1.5;
        }
        .photo { 
          max-width: 100%; 
          height: auto; 
          border-radius: 12px; 
          margin: 20px 0; 
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .timestamp {
          color: #888;
          font-size: 14px;
          text-align: center;
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #eee;
        }
        .footer { 
          text-align: center; 
          padding: 30px; 
          background: #f8f9fa;
          color: #666; 
        }
        .footer p {
          margin: 5px 0;
        }
        .celebration {
          font-size: 18px;
          margin: 15px 0;
          text-align: center;
        }
        @media (max-width: 600px) {
          .pledge-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .amount {
            margin-top: 10px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💖 New Pledge Alert! 💖</h1>
          <p>Karen's Introduction Ceremony just received a new pledge of love!</p>
        </div>
        
        <div class="content">
          <div class="celebration">
            🌸 Someone just made Karen's day more special! 🌸
          </div>
          
          <div class="pledge-card">
            <div class="pledge-header">
              <h2 class="pledger-name">🌹 ${name}</h2>
              <div class="amount">UGX ${amount.toLocaleString()}</div>
            </div>
            
            ${
              message
                ? `
              <div class="message-section">
                <strong>💌 Their Message:</strong>
                <div class="message-text">"${message}"</div>
              </div>
            `
                : ""
            }
            
            ${
              photoUrl
                ? `
              <div style="text-align: center;">
                <strong>📸 They shared a photo:</strong>
                <br>
                <img src="${photoUrl}" alt="Pledge photo from ${name}" class="photo">
              </div>
            `
                : ""
            }
            
            <div class="timestamp">
              ⏰ Pledged on: ${new Date(timestamp).toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>🎉 Making Karen's ceremony magical, one pledge at a time! 🎉</strong></p>
          <p>💕 Every contribution adds more love to this special day 💕</p>
          <p style="font-size: 12px; margin-top: 15px;">
            This is an automated notification from Karen's Introduction Ceremony Pledge System
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  const mailOptions = {
    from: '"Karen\'s Ceremony 💖" <cddavid2001@gmail.com>',
    to: [""],
    // to: ["abigabakarenpearl@gmail.com", "hssali2012@gmail.com"],
    subject: `🌸 New Pledge: UGX ${amount.toLocaleString()} from ${name} - Karen's Ceremony`,
    html: htmlContent,
    // Also include plain text version for better compatibility
    text: `
New Pledge for Karen's Introduction Ceremony!

From: ${name}
Amount: UGX ${amount.toLocaleString()}
${message ? `Message: "${message}"` : ""}
Time: ${new Date(timestamp).toLocaleString()}

${photoUrl ? `Photo included: ${photoUrl}` : ""}

Making Karen's day more beautiful, one pledge at a time! 💖
    `,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log("✅ Pledge notification email sent successfully:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("❌ Error sending email:", error)
    return { success: false, error: typeof error === "object" && error !== null && "message" in error ? (error as any).message : String(error) }
  }
}

// Test email function to verify configuration
export async function testEmailConfiguration() {
  try {
    const testResult = await transporter.verify()
    console.log("✅ Email configuration is valid:", testResult)
    return { success: true }
  } catch (error) {
    console.error("❌ Email configuration error:", error)
    return { success: false, error: typeof error === "object" && error !== null && "message" in error ? (error as any).message : String(error) }
  }
}
