import React from 'react';

const SimpleAdmin = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>
        Curtis Williams Jr. - Simple Admin Test
      </h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
        ✅ If you can see this, the routing works!
      </p>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '2rem',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h2>Quick Upload Instructions:</h2>
        <p>1. This page confirms your admin access works</p>
        <p>2. We can now add the full upload functionality</p>
        <p>3. Or provide alternative upload methods</p>
      </div>
    </div>
  );
};

export default SimpleAdmin;