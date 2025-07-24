import Button from '@/ui/Button';

export const metadata = {
  title: 'SMS Consent Form | TVPro Handy Services',
  description: 'Consent form for receiving SMS from TVPro Handy Services LLC.',
  robots: { index: false, follow: false },
};

export default function SmsConsent() {
  return (
    <main style={{maxWidth: 700, margin: '0 auto', padding: '2rem'}}>
      <h2>SMS Consent Form</h2>
      <form style={{marginTop: 24}} action="#" method="post">
        <label style={{display: 'block', marginBottom: 16, fontWeight: 500}}>
          <input type="checkbox" required style={{marginRight: 8}} />
          I agree to receive SMS from TVPro Handy Services LLC regarding appointments and service updates.
          <p style={{marginBottom: 12}}>
            I give consent for TVPro Handy Services LLC to collect my contact details and text or email me concerning this request and future company updates, appointment reminders, and customer service communications. Messaging frequency varies based on requested service. Message and data rates may apply. I also agree to the Privacy Policy and Terms and Conditions, which can be found at the links below. Text "STOP" to cancel at any time.
          </p>
          <p style={{marginBottom: 12}}>
            Message and data rates may apply. Max 4 messages/month. Text STOP to cancel. HELP for help.
          </p>
          <p>
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="sms-link">Privacy Policy</a> |
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="sms-link" style={{marginLeft: 8}}>Terms of Service</a>
          </p>
        </label>
        <div style={{marginTop: 24}}>
          <Button type="submit">Submit Consent</Button>
        </div>
      </form>
    </main>
  );
} 