import { ADLaM_Display, Inter } from 'next/font/google'


export const adlam = ADLaM_Display({
    subsets: ['latin', 'adlam'],   
    weight: ['400'],
    display: 'swap',
    variable: '--font-adlam-display',
});

export const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-inter',
});