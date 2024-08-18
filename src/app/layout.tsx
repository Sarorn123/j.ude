import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import RootProvider from "./provider/root-provider";
import { cn } from "@nextui-org/react";
import { env } from "./lib/env";

const poppin = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.HOST_NAME),
  title: {
    default: "RORN TOOL",
    template: "%s | RORN TOOL",
  },
  description:
    "TaskMaster & ReviewHub is your all-in-one solution for staying organized and sharing your opinions. Whether you are managing a complex project or simply deciding which movie to watch next, this app provides the tools you need to succeed. Join a community of organized, opinionated users and make your voice heard while staying on top of your tasks.",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "RORN TOOL",
    description:
      "TaskMaster & ReviewHub is your all-in-one solution for staying organized and sharing your opinions. Whether you are managing a complex project or simply deciding which movie to watch next, this app provides the tools you need to succeed. Join a community of organized, opinionated users and make your voice heard while staying on top of your tasks.",
    url: "https://tool.ry-sarorn.blog",
    images: [`/logo1.png`],
  },
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
