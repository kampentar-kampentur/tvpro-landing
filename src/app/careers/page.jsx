import CareersClient from "./CareersClient";

export const metadata = {
  title: "Careers - Join Our Team | TVPro Handy Services",
  description: "Become a TVPro Technician. Complete our short 3-minute application form to join our team of professional TV installers.",
};

export default function CareersPage() {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "#f6f6f8",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999
    }}>
      {/* Loading state for users with JS enabled */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px"
      }}>
        <div style={{
          width: "50px",
          height: "50px",
          border: "5px solid #dbdbdf",
          borderTop: "5px solid #0d64a0",
          borderRadius: "50%",
          animation: "spin-loader 1s linear infinite"
        }}></div>
        <p style={{
          color: "#0e0e13",
          fontSize: "18px",
          fontWeight: 500,
          fontFamily: "var(--font-red-hat-display), sans-serif"
        }}>Loading application form...</p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin-loader {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />

      {/* Semantic HTML block for search engines and users without JS */}
      <noscript>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#f6f6f8",
          padding: "2rem",
          overflowY: "auto",
          fontFamily: "sans-serif",
          color: "#0e0e13",
          zIndex: 100000
        }}>
          <h1 style={{ fontSize: "28px", marginBottom: "16px" }}>Join Our Team of Expert TV Mounting Technicians</h1>
          <p style={{ marginBottom: "24px", lineHeight: "1.6" }}>
            TVPro is always looking for skilled, reliable TV installation and handyman professionals. 
            We offer flexible schedules, competitive pay, and a supportive team. Complete our short 
            application form to apply.
          </p>
          
          <h2 style={{ fontSize: "20px", marginBottom: "16px" }}>Technician Application Form</h2>
          <form action="#" method="POST" style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "600px" }}>
            <h3>Step 1: Contact & Eligibility</h3>
            <label>Full Name: <input type="text" name="name" required /></label>
            <label>Phone Number: <input type="tel" name="phone" required /></label>
            <label>Email: <input type="email" name="email" required /></label>
            <label>City you want to work in: <input type="text" name="city" required /></label>
            <p>Are you legally authorized to work in the U.S.? (Yes/No)</p>
            <p>Are you over 18 years old? (Yes/No)</p>
            <p>Do you have a valid Driver's License and a vehicle? (Yes/No)</p>
            <p>Languages spoken: English, Spanish, Russian, Ukrainian, etc.</p>

            <h3>Step 2: Experience & Skills</h3>
            <p>Experience level: No experience, &lt; 6 months, 6-12 months, 1-2 years, 2+ years, 5+ years</p>
            <label>Where have you worked before? <textarea name="previousWork"></textarea></label>
            <p>Services performed: Drywall TV mounting, Brick/concrete mounting, Fireplace mounting, Wire concealment, etc.</p>
            <p>Do you have your own basic tools for TV installation? (Yes/No/Some tools)</p>

            <h3>Step 3: Availability & Fit</h3>
            <p>Schedule looking for: Full-time, Part-time, Weekends only, Flexible</p>
            <label>Desired weekly income: <input type="number" name="desiredIncome" /></label>
            <p>Willing to get liability insurance? (Yes/No/Already have it)</p>
            <p>Willing to pass a background check? (Yes/No)</p>
            <label>Tell us about yourself: <textarea name="about"></textarea></label>
            <label>Your strengths: <textarea name="strengths"></textarea></label>
            <label>Your weaknesses: <textarea name="weaknesses"></textarea></label>
            
            <button type="submit" style={{ padding: "10px", marginTop: "16px" }}>Submit Application</button>
            <p style={{ fontSize: "11px", color: "#6b6a73", marginTop: "12px", lineHeight: "1.4" }}>
              Your data will only be used to contact you regarding the TV Installer vacancy at TVPRO USA. 
              We will contact you to discuss your experience, working conditions, and next steps. 
              Your data will not be shared with third parties.
            </p>
          </form>
        </div>
      </noscript>
      
      <CareersClient />
    </div>
  );
}
