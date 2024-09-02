"use client";

import {
  deletePDF,
  updateHistory,
  updateSummary,
  uploadPDF,
} from "@/action/chat-pdf";
import { useUser } from "@/jotai/user";
import {
  ArrowRightIcon,
  BookOpenIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import {
  Avatar,
  Button,
  Card,
  CardFooter,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { ChatPdf } from "@prisma/client";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";
import ReactMarkdown from "react-markdown";
import CodeRenderer from "@/app/components/reusable/code-renderer";
import { useDropzone } from "react-dropzone";
import { AskBody, AskResponse } from "@/app/types/pdf-chat";
import Link from "next/link";
import dynamic from "next/dynamic";
const RenderPDF = dynamic(() => import("./render-pdf"), {
  ssr: false,
});

type Props = {
  projects: ChatPdf[];
  PDF_URL: string;
  PDF_API_KEY: string;
};

type Conversation = {
  role: string;
  content: string;
};

const PdfChatPlayground = ({ projects, PDF_API_KEY, PDF_URL }: Props) => {
  const user = useUser();

  const pathname = usePathname();
  const query = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [text, setText] = useState<string>("");
  const [conversation, setConverstion] = useState<Array<Conversation>>([]);
  const [sourceId, setSourceId] = useState<string>(query.get("sourceId") ?? "");
  const [project, setProject] = useState<ChatPdf>();
  const [isSummarying, setIsSummarying] = useState<boolean>(true);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const { isOpen, onOpenChange } = useDisclosure({ defaultOpen: !sourceId });

  const messageEl = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sourceId) return;
    const project = projects.find((p) => p.sourceId === sourceId);
    if (!project) return;
    setProject(project);
    setConverstion((project.conversation as Conversation[]) ?? []);
  }, [projects, sourceId]);

  const { trigger: ask, isMutating } = useSWRMutation(
    "/chats/message",
    askQuestion,
    {
      onError(error, key, config) {
        console.log(error);
        toast.error(error.message);
      },
    }
  );

  const { trigger: onDelete, isMutating: isDeleting } = useSWRMutation(
    "/api/upload",
    deletePDF,
    {
      onError(error, key, config) {
        console.log(error);
        toast.error(error.message);
      },
    }
  );

  const { trigger: uploadPdf, isMutating: uploading } = useSWRMutation(
    "/api/upload",
    uploadPDF,
    {
      onError(error, key, config) {
        console.log(error);
        toast.error(error.message);
      },
    }
  );

  useEffect(() => {
    if (messageEl.current) {
      const target = messageEl.current;
      target.scroll({ top: target.scrollHeight, behavior: "smooth" });
    }
  }, [conversation, messageEl]);

  const initialBody = useMemo(() => {
    return {
      sourceId,
      referenceSources: true,
      stream: true,
    };
  }, [sourceId]);

  // summary
  useEffect(() => {
    if (!project || project.summary) return setIsSummarying(false);
    setIsSummarying(true);
    const summaryBody = [
      {
        role: "user",
        content: "Summarize the pdf",
      },
    ];
    const body = { ...initialBody, stream: false, messages: summaryBody }; // not stream for this summary
    ask(body).then((message) => {
      updateSummary(sourceId, message).then((res) => {
        startTransition(() => {
          router.refresh();
          setIsSummarying(false);
        });
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialBody, project, sourceId]);

  async function askQuestion(
    url: string,
    { arg: body }: { arg: AskBody }
  ): Promise<string> {
    const response = await fetch(PDF_URL + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": PDF_API_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!body.stream) {
      const data = (await response.json()) as AskResponse;
      return data.content;
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let message = "";
    if (reader) {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        message += chunk;
        if (body.stream) setCurrentMessage((prev) => prev + chunk); // for summary not gonna stream
      }
    }
    setCurrentMessage("");
    return message;
  }

  async function hadleAsk() {
    if (!sourceId) return onOpenChange();
    if (!text) return;
    const addUserQuestion = [
      ...conversation,
      {
        role: "user",
        content: text,
      },
    ];
    setConverstion(addUserQuestion);
    const body = { ...initialBody, messages: addUserQuestion.slice(-10) }; // api allow only 10 messages
    setText("");
    ask(body).then((message) => {
      const newConvertion = [
        ...addUserQuestion,
        {
          role: "assistant",
          content: message,
        },
      ];
      setConverstion(newConvertion);
      updateHistory({ sourceId, messages: newConvertion }).then((res) => {
        console.log(res.conversation);
      });
    });
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const body = new FormData();
      acceptedFiles.forEach((file) => {
        body.append("files", file);
      });
      uploadPdf(body).then((sourceId) => {
        startTransition(() => {
          router.refresh();
        });
      });
    },
    [uploadPdf, router]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [],
    },
    maxSize: 30 * 1024 * 1024, // 30MB,
    maxFiles: 1,
  });

  return (
    <main className="container">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Chat With PDF 😀</h2>
        <Button
          isIconOnly
          color="primary"
          onClick={onOpenChange}
          variant="shadow"
        >
          <BookOpenIcon className="w-6 h-6" />
        </Button>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <div className="">
              <ModalHeader className="flex gap-1 items-center gap-x-5">
                <p>Select your PDF</p>
                {isPending && <Spinner size="sm" color="warning" />}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2  gap-5">
                  {uploading ? (
                    <div className="flex items-center justify-center border rounded-2xl h-60">
                      <Spinner className="w-10 h-10" color="primary" />
                    </div>
                  ) : (
                    <div {...getRootProps()}>
                      <Card className="cursor-pointer border-primary shadow-lg h-60 hover:scale-95 active:scale-90 border border-dashed  shadow-primary-100">
                        <div className="h-full flex justify-center items-center flex-col">
                          <div>
                            <PlusIcon className="w-10 h-10 m-auto text-primary" />
                            <p className="text-xs mt-2 text-primary">
                              Only one is allowed
                            </p>
                          </div>
                        </div>
                        <input {...getInputProps()} />
                      </Card>
                    </div>
                  )}
                  {projects.map((service) => (
                    <div
                      key={service.sourceId}
                      className="relative"
                      onClick={() => {
                        router.replace(
                          pathname + `?sourceId=${service.sourceId}`
                        );
                        setSourceId(service.sourceId);
                        onClose();
                      }}
                    >
                      <Button
                        isIconOnly
                        color="danger"
                        variant="shadow"
                        size="sm"
                        isDisabled={isDeleting}
                        className="absolute top-2 right-2 z-20"
                        onClick={(e) => {
                          onDelete(service.sourceId).then(() => {
                            startTransition(() => {
                              // delete current project
                              if (service.sourceId === sourceId) {
                                setSourceId("");
                                setProject(undefined);
                                router.push("/services/pdf-chat");
                              }
                              router.refresh();
                            });
                          });
                        }}
                      >
                        <TrashIcon className="w-6 h-6" />
                      </Button>

                      <Card className="cursor-pointer shadow-lg h-60 hover:scale-95 active:scale-90 border shadow-primary-100">
                        <Image
                          alt=""
                          className="object-cover h-40 my-4"
                          height={400}
                          src={"/pdf.png"}
                          width={400}
                          priority
                        />
                        <CardFooter className="justify-center border-t">
                          <p className="truncate">{service.name}</p>
                        </CardFooter>
                      </Card>
                    </div>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Back
                </Button>
              </ModalFooter>
            </div>
          )}
        </ModalContent>
      </Modal>

      <section className="flex mt-5 gap-x-5 h-[calc(100vh-160px)] ">
        <section className="w-[70%] border p-5 relative bg-background flex flex-col justify-between">
          <div>
            <h1 className="font-semibold text-warning pb-5">
              {projects.find((p) => p.sourceId === sourceId)?.name}
            </h1>
            <hr />
          </div>
          {/* Render Message */}
          <div className="py-5 overflow-auto space-y-2  h-full" ref={messageEl}>
            {/* render only latest 50 messages */}
            {conversation.slice(-50).map((message, index) => (
              <div key={index}>
                {message.role === "user"
                  ? renderUserMessage(message.content, user?.picture ?? "")
                  : renderAIMessage(message.content)}
              </div>
            ))}
            {/* render streaming message */}
            {currentMessage && renderAIMessage(currentMessage)}
          </div>
          {/* Ask input */}
          <div className="flex items-center gap-x-5 w-full">
            <Input
              label="ask question to PDF ..."
              value={text}
              onValueChange={setText}
              onKeyDown={(e) => {
                if (e.key === "Enter") hadleAsk();
              }}
              size="sm"
            />
            <Button
              onClick={hadleAsk}
              color="primary"
              isLoading={isMutating}
              isDisabled={isMutating || !text}
              isIconOnly
            >
              <ArrowRightIcon className="w-6 h-6" />
            </Button>
          </div>
        </section>

        <section className="flex-grow w-[30%] space-y-5">
          <h2 className="mb-2 font-semibold text-success">Summary</h2>
          {isSummarying || isPending ? (
            { ...aIThinking() }
          ) : (
            <p className="text-sm">{project?.summary}</p>
          )}
          {/* {project?.pdfs && <RenderPDF pdf={project.pdfs} />} */}
        </section>
      </section>
    </main>
  );
};

export default PdfChatPlayground;

function aIThinking() {
  return (
    <div className="flex items-center gap-x-2">
      <Image
        src={"/ai.webp"}
        alt=""
        width={50}
        height={50}
        className="w-8 h-8 rounded-full border border-warning p-1"
      />
      <Spinner size="sm" color="warning" />
    </div>
  );
}

function renderUserMessage(content: string, picture: string) {
  return (
    <div className="flex gap-x-2 justify-end">
      <section className="bg-primary text-white  ml-8 p-3 rounded-lg text-sm">
        {markdown(content)}
      </section>
      <Avatar
        className="w-8 h-8 border flex-shrink-0 border-success"
        src={picture}
      />
    </div>
  );
}
function renderAIMessage(message: string) {
  return (
    <div className="flex gap-x-2">
      <Avatar
        className="w-8 h-8 border flex-shrink-0 border-warning shadow shadow-warning"
        src={"/ai.webp"}
      />
      <section className="bg-gray-100 dark:bg-gray-800 text-foreground  mr-8 p-3 rounded-lg text-sm">
        {markdown(message)}
      </section>
    </div>
  );
}
function markdown(message: string) {
  const matches = message.match(/\[([^\]]+)\]/g);

  // Remove the square brackets from the matches
  const extractedText = matches && matches.map((match) => match.slice(1, -1));
  const cleanedText = message.replace(/\[.*?\]/g, "");

  return (
    <>
      <ReactMarkdown
        components={{
          a: ({ node, ...props }) => (
            <a
              target="_blank"
              rel="noreferrer"
              {...props}
              className="text-primary underline cursor-pointer"
            />
          ),
          code: ({ node, className, ...props }) => {
            return (
              <CodeRenderer
                // @ts-ignore
                code={node?.children[0]?.value as string}
                className={className as string}
                {...props}
              />
            );
          },
        }}
      >
        {cleanedText}
      </ReactMarkdown>
      {extractedText && (
        <p className="mt-2 text-danger">
          ( Resource from{" "}
          {extractedText.map((t) => t.replaceAll("P", "Page ")).join(", ")} )
        </p>
      )}
    </>
  );
}
