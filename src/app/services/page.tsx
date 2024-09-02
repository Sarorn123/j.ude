import { Card, CardFooter } from "@nextui-org/react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {};

export const metadata: Metadata = {
  title: "Service",
};

const services = [
  {
    name: "Manage Task",
    url: "/task-management",
    image: "/todo.jpg",
  },
  {
    name: "Judge Everything",
    url: "/judge",
    image: "/judge.jpg",
  },
  {
    name: "Qr & Barcode Generator",
    url: "/qr",
    image: "/qr.jpg",
  },
  {
    name: "Chat With PDF",
    url: "/pdf-chat",
    image: "/pdf.jpg",
  },
];

const Services = (props: Props) => {
  return (
    <main className="container overflow-auto h-full">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-primary-500">
        Services
      </h1>

      <div className="mt-2 md:mt-10 gap-5 md:gap-10 grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4">
        {services.map((service) => (
          <Link href={"/services/" + service.url} key={service.url}>
            <Card
              isFooterBlurred
              key={service.url}
              className="shadow-lg h-40 md:h-80  hover:scale-95 border shadow-warning-100"
            >
              <Image
                alt=""
                className="object-cover w-full h-full"
                height={500}
                src={service.image}
                width={500}
                priority
              />
              <CardFooter className="justify-center before:bg-white/10 border-white/20 border-2 overflow-hidden py-2 absolute before:rounded-xl rounded-large bottom-2 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                <p className="text-xs md:text-base text-primary font-semibold">
                  {service.name}
                </p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default Services;
