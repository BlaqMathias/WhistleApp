import PWA from "@/components/shared/PWA";
import ThemeSync from "@/components/shared/ThemeSync";
import Toast from "@/components/shared/Toast";
import { Bricolage_Grotesque, Poppins } from "next/font/google";
import "./globals.css";
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});
const body = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});
const themeScript = `(function(){var t='system';if(!/^\\/(login|signup)(\\/|$)/.test(location.pathname)){try{t=localStorage.getItem('whistle-theme')||'system';}catch(e){}}if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;else document.documentElement.removeAttribute('data-theme');var c=getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();if(c)document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.content=c;m.removeAttribute('media');});})();`;
// Save the install event even if the header has not hydrated yet.
const installScript = `window.addEventListener("beforeinstallprompt", function(event) {
  event.preventDefault();
  window.whistleInstalled = false;
  window.whistleInstallPrompt = event;
});
window.addEventListener("appinstalled", function() {
  delete window.whistleInstallPrompt;
  window.whistleInstalled = true;
});`;
export const metadata = {
  title: { default: "Whistle", template: "%s | Whistle" },
  description:
    "Live scores, upcoming fixtures, league tables, and campus sports on the TU sports platform.",
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F1E8" },
    { media: "(prefers-color-scheme: dark)", color: "#0D100E" },
  ],
};
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="icon"
          href="/icons/whistle-32.png"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="apple-touch-icon"
          href="/icons/apple-touch-icon.png"
          sizes="180x180"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Whistle" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: installScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <ThemeSync />
        <Toast />
        <PWA />
        {children}
      </body>
    </html>
  );
}
