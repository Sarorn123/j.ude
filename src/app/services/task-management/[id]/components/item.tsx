import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import {
  HandRaisedIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";

type ItemsType = {
  id: UniqueIdentifier;
  title: string;
  deadline?: Date;
  onActiveItem?: (id: UniqueIdentifier, forDelete?: boolean) => void;
  onOpenDeleteTaskModal?: () => void;
};

const Items = ({ id, title, onActiveItem, deadline }: ItemsType) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "item",
    },
  });

  return (
    <>
      <div
        ref={setNodeRef}
        {...attributes}
        style={{
          transition,
          transform: CSS.Translate.toString(transform),
        }}
        className={clsx(
          `px-5 py-4 shadow bg-background cursor-auto rounded-xl w-full relative  ${
            deadline && new Date() > new Date(deadline)
              ? "shadow-danger"
              : "shadow-primary"
          }`,
          isDragging && "opacity-50"
        )}
      >
        <div className="flex items-center justify-between">
          <p>{title}</p>
          <div className="flex items-center gap-2">
            <button
              className="border p-2 text-xs active:scale-95 rounded-xl shadow-lg hover:shadow-xl"
              onClick={() => onActiveItem && onActiveItem(id)}
            >
              <PencilIcon className="w-4 h-4 md:w-5 md:h-5 text-secondary-500" />
            </button>
            <button
              className="border p-2 text-xs active:scale-95 rounded-xl shadow-lg hover:shadow-xl"
              onClick={() => onActiveItem && onActiveItem(id, true)}
            >
              <TrashIcon className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
            </button>
            <button
              className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl hover:cursor-grab"
              {...listeners}
            >
              <HandRaisedIcon className="w-4 h-4 md:w-5 md:h-5  text-primary-500" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Items;
