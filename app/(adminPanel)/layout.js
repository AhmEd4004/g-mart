export const dynamic = 'force-dynamic'

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <div className="mainFrame">
      {children}
    </div>
  );
}