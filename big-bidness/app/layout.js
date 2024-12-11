import "./globals.css";
import { Navbar } from './components/Navbar';
import Head from "next/head";

export const metadata = {
  title: "Big Bidness",
  description: "Live Laugh Love",
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href ='favicon.ico?v=1' type="image/x-icon" />
      </Head>
      <body>
        <Navbar/>  
        {children}
      </body>
    </html>
  );
}
