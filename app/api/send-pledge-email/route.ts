import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const CSV_PATH = path.join(process.cwd(), "pledges.csv");
const JSON_PATH = path.join(process.cwd(), "pledges.json");

export async function POST(req: NextRequest) {
  const { name, amount, message } = await req.json();

  // Send email
  const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465
  auth: {
    user: process.env.SMTP_USER, // full Gmail address
    pass: process.env.SMTP_PASS, // 16-char app password, no spaces
  },
});


  const mailOptions = {
    from: '"Pledge System" <alltechissues@gmail.com>',
    to: "abigabakarenpearl@gmail.com, hssali2012@gmail.com, Sarahsewags@gmail.com",
    subject: "New Pledge Received",
    text: `A new pledge has been made!\n\nName: ${name}\nAmount: ₦${amount}\nMessage: ${message || "(none)"}`,
    html: `<h2>New Pledge Received!</h2><p><strong>Name:</strong> ${name}</p><p><strong>Amount:</strong> ₦${amount}</p><p><strong>Message:</strong> ${message || "(none)"}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);

    // Save to CSV
    const row = `"${name.replace(/"/g, '""')}",${amount},"${(message || "").replace(/"/g, '""')}",${new Date().toISOString()}\n`;
    if (!fs.existsSync(CSV_PATH)) {
      fs.writeFileSync(CSV_PATH, 'Name,Amount,Message,Date\n');
    }
    fs.appendFileSync(CSV_PATH, row);

    // Save to JSON
    let pledges = [];
    if (fs.existsSync(JSON_PATH)) {
      pledges = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
    }
    pledges.push({
      name,
      amount,
      message,
      date: new Date().toISOString(),
    });
    fs.writeFileSync(JSON_PATH, JSON.stringify(pledges, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email or file error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // ...existing pledge logic...

  // Define name and amount here, or retrieve them from form state/inputs
  const name = "John Doe"; // Replace with actual value from form/input
  const amount = 1000;     // Replace with actual value from form/input

  // After successful pledge, send email
  await fetch("/api/send-pledge-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, amount }),
  });

  // ...rest of your code...
};
