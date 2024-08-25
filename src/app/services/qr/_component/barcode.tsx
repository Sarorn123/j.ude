import React, { useRef, useState } from "react";
import DisplayBarcode from "react-barcode";
import { Button, Textarea } from "@nextui-org/react";
import { ArrowDownIcon } from "@heroicons/react/24/solid";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";

type Props = {};

const Barcode = (props: Props) => {
  const [text, setText] = useState<string>("");
  const barcodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleDownload = () => {
    barcodeRefs.current.forEach((ref, index) => {
      if (ref) {
        toPng(ref)
          .then((dataUrl) => {
            saveAs(dataUrl, `barcode_${index + 1}.png`);
          })
          .catch((err) => {
            console.error("Error generating barcode image:", err);
          });
      }
    });
  };

  return (
    <section className="mt-10">
      <h2 className="md:text-xl font-semibold">Barcode</h2>
      <div className="flex flex-col md:flex-row gap-x-10 mt-5">
        <div className="md:w-1/2">
          <Textarea
            type="text"
            label="Barcode Code Text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            isRequired
            description="in case of multiple barcodes, Separate by comma"
          />
        </div>

        {text && (
          <div className="md:w-1/2 mt-5 md:mt-0">
            <div className="grid gap-5">
              {text.split(",").map((barcode, index) => {
                return (
                  barcode.trim() && (
                    <div
                      key={index}
                      ref={(el) => {
                        barcodeRefs.current[index] = el;
                      }}
                    >
                      <DisplayBarcode value={barcode.trim()} />
                    </div>
                  )
                );
              })}
            </div>
            <p className="mt-5 text-warning-500 text-xs md:text-base">
              <span className="text-danger-500">Note</span> : This barcode will
              be lost. Make sure to download it.
            </p>
            <Button
              onClick={handleDownload}
              className="mt-5"
              variant="shadow"
              color="primary"
            >
              Download
              <ArrowDownIcon className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Barcode;
