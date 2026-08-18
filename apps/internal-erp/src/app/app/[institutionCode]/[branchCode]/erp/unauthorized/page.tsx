export default function UnauthorizedPage() {
  return (
    <div className="unauthorized-container" style={{ textAlign: 'center', padding: '50px' }}>
      <h1 style={{ color: 'red' }}>403 - Access Denied</h1>
      <p>You do not have the required permissions to view this resource.</p>
    </div>
  );
}
