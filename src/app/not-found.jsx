import Button from '@/ui/Button';

export default function NotFound() {
  return (
    <main style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--background)',
      textAlign: 'center',
      padding: '40px 16px'
    }}>
      <h1 style={{
        fontSize: 64,
        fontWeight: 700,
        color: 'var(--green)',
        marginBottom: 16
      }}>404</h1>
      <h2 style={{
        fontSize: 28,
        fontWeight: 600,
        color: 'var(--foreground)',
        marginBottom: 12
      }}>Page Not Found</h2>
      <p style={{
        fontSize: 18,
        color: 'var(--gray-medium)',
        marginBottom: 32
      }}>
        Sorry, the page you are looking for does not exist.<br />
        You can return to the main page.
      </p>
      <Button href="/" variant="primary" size="big" as="a">
        Go to Home
      </Button>
    </main>
  );
} 