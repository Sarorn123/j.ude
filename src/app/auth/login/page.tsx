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
                      <CardBody className="flex items-center justify-center flex-row active:scale-95 transition-all">
                        <span className="font-extrabold text-primary mr-4 text-2xl">
                          G
                        </span>
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
