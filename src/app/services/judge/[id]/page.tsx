import { getProject } from "@/action/judge";
import React from "react";
import { JudgeContainer, JudgeProject } from "@prisma/client";
import JudgePlayground from "./components/judge-playground";

type Props = {
  params: {
    id: string;
  };
};

const JudgePage = async ({ params }: Props) => {
  const project = (await getProject(params.id)) as JudgeProject & {
    containers: JudgeContainer[];
  };
  return <JudgePlayground project={project} />;
};

export default JudgePage;
