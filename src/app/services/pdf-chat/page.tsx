import { getPdfProject } from "@/action/chat-pdf";
import React from "react";
import PdfChatPlayground from "./_component/playground";
import { env } from "@/app/lib/env/server";
import { Metadata } from "next";

type Props = {};

export const metadata: Metadata = {
  title: "Chat With PDF",
};

const PDFChatPage = async (props: Props) => {
  const projects = await getPdfProject();

  return (
    <PdfChatPlayground
      projects={projects}
      PDF_API_KEY={env.PDF_API_KEY}
      PDF_URL={env.PDF_URL}
    />
  );
};

export default PDFChatPage;
