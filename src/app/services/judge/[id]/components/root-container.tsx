"use client";

import { Judge, judgeAtom, rootContainerTitle } from "@/jotai/judge";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CSS } from "@dnd-kit/utilities";
import DragCard from "./drag-card";
import { deleteImage } from "@/action/judge";
import { Spinner } from "@nextui-org/react";
import { toast } from "sonner";

type Props = {
  onSave(_containers?: Judge[]): void;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  uploading: boolean;
};

function RootContainer({
  onSave,
  setUploading,
  uploading: isUploading,
}: Props) {
  const [containers, setContainers] = useAtom(judgeAtom);
  const [deletingImage, setDeletingImage] = useState<string>();

  const rootContainer = useMemo(() => {
    return containers.find((c) => c.title === rootContainerTitle);
  }, [containers]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true);
      const body = new FormData();
      acceptedFiles.forEach((file) => {
        body.append("files", file);
      });
      await fetch("/api/upload", {
        method: "POST",
        body,
      })
        .then(async (response) => {
          const urls: string[] = await response.json();
          const uploadedFiles = urls.map((url) => ({
            id: `item-${url}`,
            image: url,
          }));
          const _containers = containers.map((c) =>
            c.id === rootContainer?.id
              ? {
                  ...rootContainer,
                  items: [...rootContainer.items, ...uploadedFiles],
                }
              : c
          );
          setContainers(_containers);
          onSave && onSave(_containers);
          setUploading(false);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong");
          setUploading(false);
        });
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [containers, rootContainer, setContainers]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/jpg": [],
      "image/png": [],
      "image/gif": [],
    },
  });

  const { attributes, setNodeRef, transform, transition } = useSortable({
    id: rootContainer!.id,
    data: {
      type: "container",
    },
  });

  function deleteItem(image: string) {
    setDeletingImage(image);
    deleteImage(image).then(() => {
      const _containers = containers.map((c) =>
        c.id === rootContainer?.id
          ? {
              ...rootContainer,
              items: rootContainer.items.filter((i) => i.image !== image),
            }
          : c
      );
      setContainers(_containers);
      onSave(_containers);
      setDeletingImage(undefined);
    });
  }

  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        "h-full w-[20%] p-5 cursor-default border bg-default-50 flex flex-col items-center gap-5"
      )}
    >
      <div
        {...getRootProps()}
        className={`border bg-default-200 py-4 flex justify-center w-36 ${
          isUploading && "pointer-events-none opacity-40"
        }`}
      >
        <p>Drop your list</p>
        <input {...getInputProps()} />
      </div>
      <SortableContext items={rootContainer?.items.map((i) => i.id) || []}>
        <div className="overflow-auto space-y-2 w-full flex flex-col items-center ">
          {isUploading && (
            <div className="flex items-center justify-center gap-3 bg-transparent !mb-2">
              <p className="text-sm">Uploading</p>
              <Spinner color="primary" size="sm" />
            </div>
          )}
          {rootContainer?.items.map((i) => (
            <DragCard
              key={i.id}
              image={i.image}
              id={i.id}
              deleteItem={deleteItem}
              deletingImage={deletingImage}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default RootContainer;
