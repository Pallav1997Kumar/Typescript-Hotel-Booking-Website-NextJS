'use client'

import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import { storePersistance } from "@/redux store/storePersistance"; 
import { PersistGate } from 'redux-persist/integration/react';

import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

import Navbar from "@/components/Navbar and Footer/Navbar";
import Footer from "@/components/Navbar and Footer/Footer";

config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

// Define the prop types for RootLayout
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en">
        <body className={inter.className}>
            <Provider store={storePersistance}>
                <Navbar />
                {children}
                <Footer />
            </Provider>
        </body>
        </html>
    );
}
