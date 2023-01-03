/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.html',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.js'
  ],
  safelist: [
    'w-64',
    'w-1/2',
    'rounded-l-lg',
    'rounded-r-lg',
    'bg-gray-200',
    'grid-cols-4',
    'grid-cols-7',
    'h-6',
    'leading-6',
    'h-9',
    'leading-9',
    'shadow-lg',
    'inline-flex',
    'flex-shrink-0',
    'justify-center',
    'items-center',
    'w-8',
    'h-8',
    'w-5',
    'h-5',
    'text-red-500',
    'bg-red-100',
    'rounded-lg',
    'dark:bg-red-800',
    'dark:text-red-200',
    'text-blue-500',
    'bg-blue-100',
    'dark:bg-blue-800',
    'dark:text-blue-200',
    'text-orange-500 ',
    'bg-orange-100',
    'dark:bg-orange-700',
    'dark:text-orange-200',
    'absolute',
    'top-5',
    'left-1/2 ',
    'transform',
    '-translate-x-1/2',
    'right-5',
    'bottom-5',
    'ml-auto',
    '-mx-1.5',
    '-my-1.5',
    'bg-white',
    'text-gray-400',
    'hover:text-gray-900',
    'focus:ring-2',
    'focus:ring-gray-300',
    'p-1.5',
    'hover:bg-gray-100',
    'dark:text-gray-500',
    'dark:hover:text-white',
    'dark:bg-gray-800',
    'dark:hover:bg-gray-700',
    'sr-only',
    'text-green-500',
    'bg-green-100',
    'dark:bg-green-800',
    'dark:text-green-200',
    'inline',
    'mr-2',
    'w-6',
    'text-gray-200',
    'animate-spin',
    'dark:text-gray-600',
    'fill-blue-600',
    'animate-a-fade-in-top',
    'animate-a-fade-out'
  ],
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
    require('flowbite/plugin')
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          '50': '#eef2ff',
          '100': '#e0e7ff',
          '200': '#c7d2fe',
          '300': '#a5b4fc',
          '400': '#818cf8',
          '500': '#6366f1',
          '600': '#4f46e5',
          '700': '#4338ca',
          '800': '#3730a3',
          '900': '#312e81'
        }
      },
      animation: {
        'a-fade-in-top': 'a-fade-in-top 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both',
        'a-fade-out': 'a-fade-out 0.5s ease-out both'
      },
      keyframes: {
        'a-fade-in-top': {
          '0%': {
            transform: 'translateY(-50px)',
          },
          '100%': {
            transform: 'translateY(0)',
          }
        },
        'a-fade-out': {
          '0%': {
            opacity: 1,
          },
          '100%': {
            opacity: 0,
          }
        }
      }
    },
    fontFamily: {
      'body': [
        'Inter',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'system-ui',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji'
      ],
      'sans': [
        'Inter',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'system-ui',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji'
      ]
    }
  }
}
