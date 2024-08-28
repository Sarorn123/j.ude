import { getProject } from "@/action/judge";
import React from "react";
import { JudgeContainer, JudgeProject } from "@prisma/client";
import JudgePlayground from "./components/judge-playground";
import { Metadata } from "next";

type Props = {
  params: {
    id: string;
  };
};

export const metadata: Metadata = {
  title: "Judge",
};

const JudgePage = async ({ params }: Props) => {
  const project = (await getProject(params.id)) as JudgeProject & {
    containers: JudgeContainer[];
  };
  return <JudgePlayground project={project} />;
};

export default JudgePage;
