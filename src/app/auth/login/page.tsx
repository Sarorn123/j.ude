"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  CardBody,
  Card,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const { isOpen, onOpenChange } = useDisclosure({
    defaultOpen: true,
    onClose() {
      router.back();
    },
  });

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Login</ModalHeader>
              <ModalBody>
                <div>
                  <Link href={"/api/login/google"}>
                    <Card>
                      <CardBody className="flex items-center gap-x-5 justify-center flex-row active:scale-95 transition-all">
                        <Image
                          src={"/google.webp"}
                          width={30}
                          height={30}
                          className="h-6 lg:w-8 w-6 lg:h-8"
                          alt=""
                        />
                        Login With Google
                      </CardBody>
                    </Card>
                  </Link>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Back
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
