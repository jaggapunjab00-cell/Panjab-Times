/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          masthead: '#0F172A',
          gold: '#EAB308',
          ivory: '#F8FAFC',
          charcoal: '#020617',
          muted: '#64748B',
          card: '#FFFFFF',
          brand: {
            primary: '#F59E0B',
            dark: '#1E293B',
            light: '#F1F5F9'
          }
        },
        fontFamily: {
          display: ['Playfair Display', 'Georgia', 'serif'],
          body: ['Outfit', 'system-ui', 'sans-serif'],
        },
      },
    },
    plugins: [],
  };