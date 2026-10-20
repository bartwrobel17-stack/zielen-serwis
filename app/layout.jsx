import "./globals.css";

export const metadata = {
  title: "Zieleń Serwis | Kompleksowe usługi ogrodnicze",
  description: "Projektowanie, zakładanie i pielęgnacja ogrodów w Łochowie, Bydgoszczy i okolicach. Zieleń Serwis: od projektu po realizację.",
  metadataBase: new URL("https://www.zielen-serwis.pl"),
  openGraph: {
    title: "Zieleń Serwis | Kompleksowe usługi ogrodnicze",
    description: "Projektowanie, zakładanie i pielęgnacja ogrodów w Łochowie, Bydgoszczy i okolicach.",
    locale: "pl_PL",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return <html lang="pl"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" /></head><body>{children}</body></html>;
}
