import '../styles/globals.css';
import Layout from '../components/Layout';
import { useState, useEffect } from 'react';

export default function App({ Component, pageProps }) {
  const [showPublish, setShowPublish] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !sessionStorage.getItem('pt_visited')) {
      sessionStorage.setItem('pt_visited', 'true');
      fetch('/api/metrics', { method: 'POST' }).catch(console.error);
    }
  }, []);

  return (
    <Layout onPublish={() => setShowPublish(true)}>
      <Component
        {...pageProps}
        globalShowPublish={showPublish}
        setGlobalShowPublish={setShowPublish}
      />
    </Layout>
  );
}