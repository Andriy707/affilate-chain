// src/app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Affiliate Marketing Chain',
    description: 'Discover amazing offers and save money',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <header className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">W</span>
                        </div>
                        <span className="text-xl font-semibold text-gray-800">WiseSavings</span>
                    </div>
                    {/* Admin button removed - access via /admin directly */}
                </div>
            </div>
        </header>
        {children}
        </body>
        </html>
    )
}