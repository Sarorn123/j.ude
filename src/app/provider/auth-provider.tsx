"use client";

import { userAtom } from "@/jotai/user";
import { User } from "@prisma/client";
import { useSetAtom } from "jotai";
import React, { useEffect } from "react";

type Props = {
  user?: User;
  children: React.ReactNode;
};

const AuthProvider = ({ user, children }: Props) => {
  const setUser = useSetAtom(userAtom);

  useEffect(() => {
    user && setUser(user);
  }, [setUser, user]);
  return <>{children}</>;
};

export default AuthProvider;
