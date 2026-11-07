/** Tailwind build config for the Hard & Soft storefront.
 *  Rebuild after editing markup:  npx tailwindcss@3.4.16 -c tailwind.config.cjs -i assets/tailwind.src.css -o assets/tailwind.css --minify */
module.exports = {
  content: ['./*.html', './assets/app.js'],
  theme: { extend: {
    colors: { ink: '#0E0E0D', ivory: '#F7F4EE', bone: '#EDE8DF', gold: '#B08D57', stone: '#7E786D', charcoal: '#1A1A19' },
    fontFamily: { display: ['"Cormorant Garamond"', 'Didot', 'Georgia', 'serif'], sans: ['Jost', '"Helvetica Neue"', 'Arial', 'sans-serif'] }
  } }
};
