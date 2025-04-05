import NextTopLoader from "nextjs-toploader";
import React from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NextTopLoader
        color="#f44336" // Material Design Red 500
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
        shadow="0 0 10px #f44336,0 0 5px #f44336" // Updated shadow color
      />
      {children}
    </>
  );
}
