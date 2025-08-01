
import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";

export default {
        content: [
                "./index.html",
                "./src/**/*.{ts,tsx}",
        ],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '1.5rem',
				md: '2rem',
				lg: '4rem',
				xl: '5rem',
			},
		},
		// Mobile-first breakpoints otimizados para dispositivos premium
            screens: {
                        'xs': '375px',    // iPhone 13/14 Standard
                        'sm': '414px',    // iPhone Plus/Pro Max
                        'md': '768px',    // iPad Mini
                        'lg': '1024px',   // iPad Pro / Desktop básico
                        'xl': '1440px',   // new threshold for larger desktops
                        '2xl': '1536px',  // Desktop grande
                },
		extend: {
                        fontFamily: {
                                sans: ['Comfortaa', 'sans-serif'],
                        },
			// Tamanhos de fonte otimizados para mobile
			fontSize: {
				'xs': ['0.75rem', { lineHeight: '1rem' }],
				'sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'base': ['1rem', { lineHeight: '1.5rem' }],      // 16px base
				'lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],       // 24px mobile h1
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],  // 30px desktop h1
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1' }],
			},
			// Espaçamentos otimizados para touch
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'safe-top': 'env(safe-area-inset-top)',
				'safe-bottom': 'env(safe-area-inset-bottom)',
				'safe-left': 'env(safe-area-inset-left)',
				'safe-right': 'env(safe-area-inset-right)',
			},
			// Altura mínima para elementos touch (48px recomendado)
			minHeight: {
				'touch': '48px',
				'touch-lg': '56px',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
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
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
                                libra: {
                                        navy: '#003399', // Cor principal
                                        gold: '#D4AF37',
                                        silver: '#F0F0F0',
                                        blue: '#003399', // Cor de enfase alterada
                                        light: '#F8F9FA',
                                        green: '#22c55e'
                                }
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'slide-up': 'slide-up 0.5s ease-out'
			},
			backgroundImage: {
				'hero-pattern': 'linear-gradient(to right, rgba(0, 51, 153, 0.9), rgba(0, 51, 153, 0.7))',
				'gold-gradient': 'linear-gradient(90deg, #D4AF37 0%, #F2D57E 50%, #D4AF37 100%)'
			}
		}
	},
        plugins: [animatePlugin],
} satisfies Config;
