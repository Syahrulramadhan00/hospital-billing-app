import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    DEFAULT: '#0a7efa',
                    50: '#f0f7ff',
                    100: '#e0f0ff',
                    200: '#bae0ff',
                    300: '#7ecfff',
                    400: '#39baff',
                    500: '#0a9eff',
                    600: '#0a7efa',
                    700: '#0a5fd4',
                    800: '#0a46ad',
                    900: '#0a3a8a',
                },
                secondary: {
                    DEFAULT: '#e8e8e8',
                    50: '#fafafa',
                    100: '#f5f5f5',
                    200: '#e8e8e8',
                    300: '#d4d4d4',
                    400: '#a1a1a1',
                    500: '#808080',
                    600: '#6b6b6b',
                },
                text: {
                    DEFAULT: '#1f2937',
                    light: '#FFFAFA',
                    dark: '#FFFAFA',
                },
            },
            textColor: {
                DEFAULT: '#1f2937',
                light: '#FFFAFA',
                dark: '#FFFAFA',
            },
        },
    },

    daisyui: {
        themes: [
            {
                light: {
                    primary: '#0a7efa',
                    secondary: '#e8e8e8',
                    accent: '#37cdbe',
                    neutral: '#3d3d3d',
                    'base-100': '#ffffff',
                    'base-200': '#f9fafb',
                    'base-300': '#eff1f5',
                    info: '#3b82f6',
                    success: '#10b981',
                    warning: '#f59e0b',
                    error: '#ef4444',
                },
            },
            {
                dark: {
                    primary: '#0a7efa',
                    secondary: '#e8e8e8',
                    accent: '#37cdbe',
                    neutral: '#3d3d3d',
                    'base-100': '#1f2937',
                    'base-200': '#111827',
                    'base-300': '#0f172a',
                    info: '#3b82f6',
                    success: '#10b981',
                    warning: '#f59e0b',
                    error: '#ef4444',
                    '--base-content': '#FFFAFA',
                },
            },
        ],
    },

    plugins: [forms, daisyui],
};
