import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, fullName, ipAddress, userAgent } = await request.json();

    // Misali idan ana amfani da Resend API (ko zaka iya amfani da Nodemailer)
    // lura: Tabbatar ka sanya RESEND_API_KEY a .env.local dinka
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.warn('RESEND_API_KEY is not set. Skipping email notification.');
      return NextResponse.json({ success: true, message: 'Notification skipped (no key)' });
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #65a30d;">ALPHA PROFICIENCY TECHNOLOGY</h2>
        <h3>Security Alert: New Account Login</h3>
        <p>Sannu <b>${fullName}</b>,</p>
        <p>An samu shiga asusunka na <b>APT Ambassador Portal</b> yanzu haka.</p>
        <hr style="border: 0.5px solid #eee;" />
        <ul>
          <li><b>Account Email:</b> ${email}</li>
          <li><b>Kwanan Wata:</b> ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lagos' })}</li>
        </ul>
        <p style="color: #e11d48; font-size: 13px;">
          <b>Lura:</b> Idan kai ne ka shiga, ba ka da abun yi. Idan kuma ba kai ba ne ka shiga ba, maza ka tuntubi MD Office ko ka sauya kalmar sirrinka nan take.
        </p>
        <p style="font-size: 11px; color: #777;">© 2026 Alpha Proficiency Technology. All rights reserved.</p>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'APT Security <security@alphaproficiency.com>',
        to: [email],
        subject: '🔐 Security Alert: New Login to your APT Ambassador Account',
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error('Failed to send Resend notification:', errData);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending login email notification:', error);
    return NextResponse.json({ success: false, error: 'Failed to send notification' }, { status: 500 });
  }
}
