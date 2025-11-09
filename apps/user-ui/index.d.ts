/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}

///** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     './{src,pages,components,app}/**/*.{ts,tsx,js,jsx,html}',
//     '!./{src,pages,components,app}/**/*.{stories,spec}.{ts,tsx,js,jsx,html}',
//     //     ...createGlobPatternsForDependencies(__dirname)
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         roboto: ['var(--font-roboto)'],
//         poppins: ['var(--font-poppins)'],
//       },
//     },
//   },
//   plugins: [],
// };
//