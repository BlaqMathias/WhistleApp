import "./globals.css";
import {Bricolage_Grotesque, Poppins} from "next/font/google";
import PWA from "@/components/shared/PWA";
import ThemeSync from "@/components/shared/ThemeSync";
const display = Bricolage_Grotesque({subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-bricolage", display: "swap"});
const body = Poppins({subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins", display: "swap"});
const themeScript = `(function(){var t='system';if(!/^\\/(login|signup)(\\/|$)/.test(location.pathname)){try{t=localStorage.getItem('whistle-theme')||'system';}catch(e){}}if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;else document.documentElement.removeAttribute('data-theme');var c=getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();if(c)document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.content=c;m.removeAttribute('media');});})();`;
export const metadata = {
  title: {default: "Whistle | Topfaith campus sports", template: "%s | Whistle"},
  description: "Live scores, upcoming fixtures, league tables, and campus sports at Topfaith University.",
};
export const viewport = {
  width: "device-width", initialScale: 1, viewportFit: "cover",
  themeColor: [{media: "(prefers-color-scheme: light)", color: "#F4F1E8"}, {media: "(prefers-color-scheme: dark)", color: "#0D100E"}],
};
export default function RootLayout({children}) {
  return <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning><head>
    <link rel="manifest" href="/manifest.json"/><link rel="icon" href="/icons/whistle.svg" type="image/svg+xml"/><link rel="apple-touch-icon" href="/icons/icon-192.png"/>
    <meta name="mobile-web-app-capable" content="yes"/><meta name="apple-mobile-web-app-capable" content="yes"/><meta name="apple-mobile-web-app-title" content="Whistle"/><meta name="apple-mobile-web-app-status-bar-style" content="default"/>
    <script dangerouslySetInnerHTML={{__html: themeScript}}/>
  </head><body><a className="skip-link" href="#main">Skip to content</a><ThemeSync/><PWA/>{children}</body></html>;
}
