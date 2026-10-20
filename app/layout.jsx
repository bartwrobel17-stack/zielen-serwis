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
  return <html lang="pl"><body>{children}</body></html>;
}
