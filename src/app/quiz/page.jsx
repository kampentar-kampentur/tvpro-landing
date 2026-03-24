import QuizClient from "./QuizClient";

export const metadata = {
  title: "Get a Best Quote | TVPro Handy Services",
  description: "Complete our quick quiz to get the best quote for your TV mounting or home theater installation.",
};

export default function QuizPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--background-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <QuizClient />
      <div style={{ textAlign: 'center', opacity: 0.5 }}>
        <h1>Loading Quiz...</h1>
        <p>If the quiz doesn't open automatically, please click the button below.</p>
      </div>
    </div>
  );
}
