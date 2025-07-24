export const metadata = {
  title: 'Privacy Policy for SMS Messaging | TVPro Handy Services',
  description: 'How TVPro Handy Services collects, uses, and protects your data for SMS messaging.',
  robots: { index: false, follow: false },
};

export default function PrivacyPolicy() {
  return (
    <main style={{maxWidth: 700, margin: '0 auto', padding: '2rem'}}>
      <h1>Privacy Policy for SMS Messaging</h1>
      <p><strong>Effective Date:</strong> June 2025</p>
      <p>This SMS Privacy Policy explains how TVPro Handy Services ("we", "us", "our") collects and uses information related to our SMS messaging service.</p>
      <ol>
        <li><strong>What data we collect</strong><br/>We collect your phone number and optional name when you opt in via our website form.</li>
        <li><strong>How we collect data</strong><br/>Through our opt-in form where you check a box to receive SMS.</li>
        <li><strong>How we use data</strong><br/>To send appointment reminders, service updates, and occasional promotional messages (max 4/month).</li>
        <li><strong>Sharing data</strong><br/>We do NOT sell or share your personal data with third parties for marketing. We may share with SMS providers or carriers only for message delivery.</li>
        <li><strong>Opt‑out</strong><br/>Reply “STOP” to any SMS to unsubscribe. We also allow “HELP” for support.</li>
        <li><strong>Security & retention</strong><br/>We store data securely and retain it only as long as needed to provide SMS service.</li>
        <li><strong>Legal compliance</strong><br/>We use your data in compliance with TCPA, GDPR, CCPA and industry standards.</li>
      </ol>
    </main>
  );
} 