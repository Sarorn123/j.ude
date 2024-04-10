import React from "react";
import { Avatar, Button } from "@nextui-org/react";
import {
  getKindeServerSession,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";
import NavbarLink from "./nav-bar-link";
import ThemeSwitcher from "../reusable/theme-switcher";
export default async function NavbarComponent() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser();
  const authenticated = await isAuthenticated();

  return (
    <nav>
      <section className="container flex items-center justify-between h-20 ">
        <h1 className="text-2xl font-semibold text-primary-500 shadow p-2 px-4 bg-background border">J.UDGE</h1>
        <div className="flex items-center gap-5">
          <NavbarLink />
          <ThemeSwitcher />
          {authenticated ? (
            <>
              <Avatar src={user?.picture || ""} name={user?.given_name || ""} />
              <LogoutLink>
                <Button color="danger">Logout</Button>
              </LogoutLink>
            </>
          ) : (
            <LoginLink>
              <Button color="primary">Log In</Button>
            </LoginLink>
          )}
        </div>
      </section>
    </nav>
  );
}
