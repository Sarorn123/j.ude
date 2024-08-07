"use client";

import {
  UserIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/16/solid";
import {
  Button,
  Dropdown,
  DropdownSection,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@nextui-org/react";
import { User } from "@prisma/client";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";

const iconClasses =
  "text-2xl text-default-500 pointer-events-none flex-shrink-0";

type Props = {
  user: User;
};

export const AvatarDropDown = ({ user }: Props) => {
  const router = useRouter();

  return (
    <Dropdown className="shadow-xl" placement="bottom">
      <DropdownTrigger>
        <Avatar
          src={user?.picture || ""}
          name={user?.name || ""}
          className="cursor-pointer"
          color="primary"
          isBordered
        />
      </DropdownTrigger>
      <DropdownMenu
        closeOnSelect
        aria-label="Profile"
        color="default"
        variant="flat"
      >
        <DropdownSection title="Profile">
          <DropdownItem
            key="me"
            isReadOnly
            description={user?.email}
            // shortcut="⌘A"
            startContent={
              <UserIcon name={""} className="w-8 h-8 text-primary" />
            }
          >
            {user?.name}
          </DropdownItem>
        </DropdownSection>
        <DropdownSection title="Danger zone">
          <DropdownItem
            key="log-out"
            className="text-danger"
            color="danger"
            description="Log out from this account"
            // shortcut="⌘⇧D"
            startContent={
              <ArrowLeftStartOnRectangleIcon
                className={clsx(iconClasses, "!text-danger w-6 h-6")}
              />
            }
            onClick={() => {
              router.push("/api/sign-out");
              router.refresh();
            }}
          >
            Log Out
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};
