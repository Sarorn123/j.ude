import React, { PropsWithChildren } from "react";
import { NextUIProviders } from "./next-ui-provider";
import { Provider as JotaiProvider } from "jotai";
import { Toaster } from "sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import AuthProvider from "./auth-provider";
import NextTopLoader from "nextjs-toploader";
import { getCurrentUser } from "@/app/lib/session";
import NavbarComponent from "../general/nav-bar";

const RootProvider = async ({ children }: PropsWithChildren) => {
  const user = await getCurrentUser();

  return (
    <JotaiProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <NextUIProviders>
          <AuthProvider user={user}>
            <NextTopLoader
              showSpinner={false}
              shadow={"#016fee"}
              color="#016fee"
            />
            <Toaster richColors duration={1000} />
            <div className="dark:hidden opacity-0 absolute inset-0 -z-40 h-full w-full bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
            <div className="opacity-20 absolute inset-0 -z-40 h-full w-full bg-[linear-gradient(to_right,#a39f9e_1px,transparent_1px),linear-gradient(to_bottom,#a39f9e_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
            <NavbarComponent />
            <div className="overflow-auto h-[calc(100vh-80px)]">{children}</div>
          </AuthProvider>
        </NextUIProviders>
      </NextThemesProvider>
    </JotaiProvider>
  );
};

export default RootProvider;
