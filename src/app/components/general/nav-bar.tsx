import React from "react";
import { Button } from "@nextui-org/react";
import NavbarLink from "./nav-bar-link";
import ThemeSwitcher from "../reusable/theme-switcher";
import { getCurrentUser } from "@/app/lib/session";
import Link from "next/link";
import { AvatarDropDown } from "../reusable/avatar-dropdown";
export default async function NavbarComponent() {
  const user = await getCurrentUser();

  return (
    <nav>
      <section className="container flex items-center justify-between h-20 ">
        <h1 className=" md:text-2xl font-semibold text-primary-500 p-2">
          J.UDGE
        </h1>
        <div className=" items-center gap-5 flex">
          <div className="hidden md:block">
            <NavbarLink />
          </div>
          <ThemeSwitcher />
          {user ? (
            <>
              <AvatarDropDown user={user} />
            </>
          ) : (
            <Link href={"/auth/login"}>
              <Button color="primary">Log In</Button>
            </Link>
          )}
        </div>

        <div className="fixed bottom-0 z-50 left-0 w-full md:hidden backdrop-blur-xl py-5 flex justify-center items-center border-t">
          <NavbarLink />
        </div>
      </section>
    </nav>
  );
}
