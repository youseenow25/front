// Force dynamic rendering to prevent build timeout
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '40px 20px',
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '16px', fontWeight: 'bold' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Page Not Found</h2>
      <p style={{ marginBottom: '32px', color: '#666', maxWidth: '500px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a
        href="/"
        style={{
          padding: '12px 24px',
          backgroundColor: '#000',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 500,
          display: 'inline-block'
        }}
      >
        Go Home
      </a>
    </div>
  )
}
