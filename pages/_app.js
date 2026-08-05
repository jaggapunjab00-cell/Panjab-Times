import '../styles/globals.css';
import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const [showPublish, setShowPublish] = useState(false);
  const router = useRouter();

  // Admin pages use their own standalone layout — no masthead/footer
  const isAdminPage = router.pathname.startsWith('/admin');

  useEffect(() => {
    if (typeof window !== 'undefined' && !sessionStorage.getItem('pt_visited')) {
      sessionStorage.setItem('pt_visited', 'true');
      fetch('/api/metrics', { method: 'POST' }).catch(console.error);
    }
  }, []);

  if (isAdminPage) {
    return <Component {...pageProps} />;
  }

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