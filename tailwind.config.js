import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

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
        },
        colors: {
            pastelGreen: '#16BE27FF', // Verde militar pastel
            black: '#000000FF', // Morado pastel // Rosa pastel
            white: '#FFFFFF',
            pink: '#FF0080FF', // Rosa pastel
            fondo: '#61D769FF',
        },
    },

    plugins: [forms],
};
