import "./globals.css";

export const metadata = {
  title: "Sentitrade",
  description: "Real-Time Fraud & Sentiment Intelligence",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ background: "#020817", color: "white", fontFamily: "sans-serif", overflowX: "hidden" }}>
        {children}
      </body>
    </html>
  );
}