import { ADLaM_Display } from 'next/font/google'


export const adlam = ADLaM_Display({
    subsets: ['latin', 'adlam'],    // ADLaM es otro subconjunto aparte de latin :contentReference[oaicite:1]{index=1}
    weight: ['400'],
    display: 'swap',
    variable: '--font-adlam-display',
});