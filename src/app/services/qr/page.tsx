"use client";

import React, { useState } from "react";
import QRCode from "qrcode";
import { Button, Textarea } from "@nextui-org/react";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowDownIcon } from "@heroicons/react/16/solid";
import Barcode from "./_component/barcode";
import { saveAs } from "file-saver";
import { Metadata } from "next";

type Props = {};

const QRCodePage = (props: Props) => {
  const [data, setData] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  function generate(text: string) {
    if (text.length == 0 || text.length > 500) return setIsInvalid(true);
    QRCode.toDataURL(text, { scale: 10, errorCorrectionLevel: "H" })
      .then((url) => {
        setData(url);
        setIsInvalid(false);
      })
      .catch((err) => {
        toast.error("Error Generating QR Code", err.message);
      });
  }

  return (
    <main className="container overflow-auto">
      <h2 className="md:text-xl font-semibold">QR Code </h2>
      <div className="flex flex-col md:flex-row  gap-x-10 mt-5">
        <div className="md:w-1/2">
          <Textarea
            type="text"
            label="Qr Code Text"
            value={text}
            onChange={(e) => {
              const _text = e.target.value;
              setText(_text);
              generate(_text);
            }}
            isRequired
            isInvalid={isInvalid}
            errorMessage="Please enter some text"
          />
        </div>
        {data ? (
          <div className="md:w-1/2 mt-5 md:mt-0">
            <Image
              src={data}
              alt=""
              width={200}
              height={200}
              className="border border-primary-100 shadow"
            />
            <p className="mt-5 text-warning-500 text-xs md:text-base">
              <span className="text-danger-500">Note</span> : This qrcode will
              lost. make sure to download it.
            </p>
            <Button
              onClick={() => {
                saveAs(data, "qrcode.png");
              }}
              className="mt-5"
              variant="shadow"
              color="primary"
            >
              Download
              <ArrowDownIcon className="h-5 w-5" />
            </Button>
          </div>
        ) : null}
      </div>
      <hr className="my-5" />
      <Barcode />
    </main>
  );
};

export default QRCodePage;
