import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import RootProvider from "./provider/root-provider";
import { cn } from "@nextui-org/react";

const poppin = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "J.UDGE",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(poppin.className, "overflow-y-hidden")}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
