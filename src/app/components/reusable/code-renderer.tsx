import { ClipboardIcon } from "@heroicons/react/16/solid";
import { Button } from "@nextui-org/react";
import React from "react";
import { CodeBlock } from "react-code-block";
import { useCopyToClipboard } from "react-use";

type Props = {
  code: string;
  className: string;
};

const CodeRenderer = ({ code, className, ...props }: Props) => {
  const language = className ? className.replace("language-", "") : "text";
  const [state, copyToClipboard] = useCopyToClipboard();

  return (
    <CodeBlock code={code} language={language} {...props}>
      <div className="relative">
        <CodeBlock.Code className=" bg-gray-800 dark:bg-background p-4 rounded-xl shadow-lg my-2">
          <div className="table-row">
            <CodeBlock.LineNumber className="table-cell pr-4 text-sm text-gray-500 text-right select-none" />
            <CodeBlock.LineContent className="table-cell">
              <CodeBlock.Token />
            </CodeBlock.LineContent>
          </div>
        </CodeBlock.Code>
        <Button
          className=" absolute top-2 right-2"
          onClick={() => copyToClipboard(code)}
          color={state.value ? "default" : "primary"}
          variant="shadow"
          isIconOnly
          size="sm"
        >
          <ClipboardIcon className="w-4 h-4" />
        </Button>
      </div>
    </CodeBlock>
  );
};

export default CodeRenderer;
