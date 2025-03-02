import { UserProvider } from "@/lib/contexts";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
