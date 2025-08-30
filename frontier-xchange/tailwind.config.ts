import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace'],
			},
      colors: {
        border: 'hsl(var(--border))',
        'border-bright': 'hsl(var(--border-bright))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        'background-secondary': 'hsl(var(--background-secondary))',
        'background-tertiary': 'hsl(var(--background-tertiary))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          50: 'hsl(var(--primary-50))',
          100: 'hsl(var(--primary-100))',
          200: 'hsl(var(--primary-200))',
          300: 'hsl(var(--primary-300))',
          400: 'hsl(var(--primary-400))',
          500: 'hsl(var(--primary-500))',
          600: 'hsl(var(--primary-600))',
          700: 'hsl(var(--primary-700))',
          800: 'hsl(var(--primary-800))',
          900: 'hsl(var(--primary-900))',
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        gray: {
          50: 'hsl(var(--gray-50))',
          100: 'hsl(var(--gray-100))',
          200: 'hsl(var(--gray-200))',
          300: 'hsl(var(--gray-300))',
          400: 'hsl(var(--gray-400))',
          500: 'hsl(var(--gray-500))',
          600: 'hsl(var(--gray-600))',
          700: 'hsl(var(--gray-700))',
          800: 'hsl(var(--gray-800))',
          900: 'hsl(var(--gray-900))',
          950: 'hsl(var(--gray-950))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
          glass: 'hsl(var(--card-glass))'
        },
        success: {
          light: 'hsl(var(--success-light))',
          DEFAULT: 'hsl(var(--success))',
          dark: 'hsl(var(--success-dark))',
        },
        warning: {
          light: 'hsl(var(--warning-light))',
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
          dark: 'hsl(var(--warning-dark))',
        },
        error: {
          light: 'hsl(var(--error-light))',
          DEFAULT: 'hsl(var(--error))',
          dark: 'hsl(var(--error-dark))',
        },
        info: {
          light: 'hsl(var(--info-light))',
          DEFAULT: 'hsl(var(--info))',
          dark: 'hsl(var(--info-dark))',
        },
        'neon-red': {
          DEFAULT: 'hsl(var(--neon-red))',
          foreground: 'hsl(var(--neon-red-foreground))'
        },
        'neon-yellow': {
          DEFAULT: 'hsl(var(--neon-yellow))',
          foreground: 'hsl(var(--neon-yellow-foreground))'
        }
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-hero': 'var(--gradient-hero)',
        'gradient-animated': 'var(--gradient-animated)',
        'gradient-card': 'var(--gradient-card)',
        'gradient-success': 'var(--gradient-success)',
        'gradient-glass': 'var(--gradient-glass)',
        'gradient-glow': 'var(--gradient-glow)',
        'gradient-subtle': 'var(--gradient-subtle)',
      },
      boxShadow: {
        'xs': 'var(--shadow-xs)',
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        'green': 'var(--shadow-green)',
        'card': 'var(--shadow-card)',
      },
			backdropBlur: {
				'xs': '2px',
				'sm': '4px',
				'md': '8px',
				'lg': '16px',
				'xl': '24px',
				'2xl': '40px',
			},
			borderRadius: {
				'none': '0px',
				'sm': 'var(--radius-sm)',
				'md': 'var(--radius-md)',
				'lg': 'var(--radius-lg)',
				'xl': 'var(--radius-xl)',
			},
			transitionTimingFunction: {
				'ultra-smooth': 'var(--transition-ultra-smooth)',
				'bounce': 'var(--transition-bounce)',
				'elastic': 'var(--transition-elastic)',
			},
			keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-8px) rotate(1deg)' },
          '66%': { transform: 'translateY(-4px) rotate(-1deg)' }
        },
        'pulse-gentle': {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' }
        },
        'slide-in-up': {
          '0%': { opacity: '0', transform: 'translateY(40px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-40px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' }
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(40px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'floating-orbs': {
          '0%, 100%': { 
            transform: 'translateY(0px) translateX(0px) scale(1)',
            opacity: '0.6'
          },
          '25%': { 
            transform: 'translateY(-20px) translateX(10px) scale(1.1)',
            opacity: '0.8'
          },
          '50%': { 
            transform: 'translateY(-10px) translateX(-15px) scale(0.9)',
            opacity: '1'
          },
          '75%': { 
            transform: 'translateY(-25px) translateX(5px) scale(1.05)',
            opacity: '0.7'
          }
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        }
			},
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 4s ease-in-out infinite',
        'pulse-gentle': 'pulse-gentle 3s ease-in-out infinite',
        'slide-in-up': 'slide-in-up 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
        'slide-in-left': 'slide-in-left 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
        'slide-in-right': 'slide-in-right 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
        'fade-in': 'fade-in 0.5s ease-out',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
        'floating-orbs': 'floating-orbs 12s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'gradient': 'gradient-shift 8s ease infinite'
      }
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
