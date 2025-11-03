/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Minimalist grey palette
        neutral: {
          50: '#fafafa',   // page background
          100: '#f5f5f5',  // subtle hover
          200: '#e5e5e5',  // borders
          300: '#d4d4d4',  // disabled
          400: '#a3a3a3',  // metadata text
          500: '#737373',  // tertiary text
          600: '#525252',  // secondary text
          700: '#262626',  // button hover
          800: '#171717',  // primary text/buttons
          900: '#0a0a0a',  // rare deep black
        },
      },
      spacing: {
        // Linear-style spacing scale
        '18': '4.5rem',  // 72px
        '22': '5.5rem',  // 88px
      },
      boxShadow: {
        'none': 'none',  // completely flat (Linear-style)
      },
      borderRadius: {
        'subtle': '4px',   // small, clean corners
        'card': '8px',     // card/panel corners
      },
      maxWidth: {
        'content': '900px',  // max content width (Linear-style)
      },
    },
  },
  plugins: [],
}

