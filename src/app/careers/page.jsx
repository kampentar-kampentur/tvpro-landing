import CareersClient from "./CareersClient";

export const metadata = {
  title: "Careers - Join Our Team | TVPro Handy Services",
  description: "Become a TVPro Technician. Complete our short 3-minute application form.",
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
      
      <CareersClient />
    </div>
  );
}
