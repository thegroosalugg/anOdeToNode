import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <header
        style={{
          background: 'var(--party-purple)',
               color: 'white',
             padding: '0.5rem',
           textAlign: 'center',
        }}
      >
        DenoREST
      </header>
      <main id='main'>
        <h1>Hello</h1>
        <h2>Hello</h2>
        <h3>Hello</h3>
        <h4>Hello</h4>
        <h5>Hello</h5>
        <h6>Hello</h6>
      </main>
    </>
  );
}

export default App;
