import { getProject } from "@/action/task";
import React from "react";
import TaskManagementPlayground from "./components/manage-task-playground";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type Props = {
  params: {
    id: string;
  };
};

export const metadata: Metadata = {
  title: "Task Management",
};

const TaskManagement = async ({ params: { id } }: Props) => {
  const project = await getProject(id);
  if (!project) notFound();

  return <TaskManagementPlayground project={project} />;
};

export default TaskManagement;
