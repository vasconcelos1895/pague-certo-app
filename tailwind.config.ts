import type { Config } from "tailwindcss"

const config = {
  darkMode: 'class', // Corrigido para ser uma string, não um array
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true, // Corrigido para não ser uma string
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        gett: {
          DEFAULT: 'oklch(0.44 0.07 188)', // Cor padrão para tema claro
          dark: 'oklch(0.25 0.05 188)',   //  Cor quando o modo escuro está ativo
        },
        gettForeground: {
          DEFAULT: 'oklch(0.88 0.02 95)', // Cor de primeiro plano para tema claro
          dark: 'oklch(0.98 0.05 95)',    // Cor de primeiro plano para modo escuro
        },
      },
    },
  },
} satisfies Config

export default config