"use client";

import { useState } from 'react';

export default function BootstrapPage() {
  const [status, setStatus] = useState<string>('');

  const handleBootstrap = async () => {
    setStatus('Initializing...');
    try {
      const res = await fetch('/api/v1/tenant/bootstrap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secret: process.env.NEXT_PUBLIC_BOOTSTRAP_SECRET })
      });
      if (res.ok) {
        setStatus('System Successfully Bootstrapped. The primary institution SUH01 and System Owner role are ready.');
      } else {
        setStatus('Bootstrap failed. System may already be initialized or secret is invalid.');
      }
    } catch (e) {
      setStatus('Network Error.');
    }
  };

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
      <h1>Super Admin System Bootstrap</h1>
      <p>Initialize the first Institution and System Owner profile.</p>
      <button 
        onClick={handleBootstrap}
        style={{ padding: '10px 20px', background: 'black', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        Run Seed Operations
      </button>
      <p style={{ marginTop: '20px', color: 'green' }}>{status}</p>
    </div>
  );
}
