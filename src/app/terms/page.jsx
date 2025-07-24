export const metadata = {
  title: 'SMS Terms and Conditions | TVPro Handy Services',
  description: 'Terms and conditions for SMS messaging with TVPro Handy Services.',
  robots: { index: false, follow: false },
};

export default function Terms() {
  return (
    <main style={{maxWidth: 700, margin: '0 auto', padding: '2rem'}}>
      <h1>SMS Terms and Conditions</h1>
      <p><strong>Effective Date:</strong> June 2025</p>
      <p>By opting in, you agree to these terms:</p>
      <ol>
        <li><strong>Program Description</strong><br/>You will receive appointment reminders, service notifications, and occasional offers via SMS from TVPro Handy Services.</li>
        <li><strong>Frequency</strong><br/>Up to 4 messages per month.</li>
        <li><strong>Message & data rates</strong><br/>Standard message and data rates may apply.</li>
        <li><strong>Opt‑out</strong><br/>Text “STOP” to our number to unsubscribe. You'll receive one confirmation message and no further messages.</li>
        <li><strong>Help</strong><br/>Text “HELP” to our number for support or email us at <a href="mailto:tvprohandyservices@gmail.com">tvprohandyservices@gmail.com </a>.</li>
        <li><strong>Liability</strong><br/>Carriers aren’t responsible for message delays or failures.</li>
        <li><strong>Privacy</strong><br/>See our <a href="/privacy-policy">Privacy Policy</a>.</li>
      </ol>
    </main>
  );
} 