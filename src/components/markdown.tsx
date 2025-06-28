"use client";
import "./markdown.css";

import {
  MDXEditor,
  MDXEditorMethods,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
} from "@mdxeditor/editor";
import { FC } from "react";

interface EditorProps {
  markdown: string;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}

const Markdown: FC<EditorProps> = ({ markdown, editorRef }) => (
  <MDXEditor
    ref={editorRef}
    markdown={markdown}
    className="markdown-editor"
    readOnly={true}
    plugins={[
      listsPlugin(),
      quotePlugin(),
      headingsPlugin(),
      linkPlugin(),
      linkDialogPlugin(),
      imagePlugin(),
      tablePlugin(),
      thematicBreakPlugin(),
      frontmatterPlugin(),
      codeBlockPlugin(),
      codeMirrorPlugin({
        codeBlockLanguages: {
          js: "JavaScript",
          css: "CSS",
          txt: "text",
          tsx: "TypeScript",
        },
      }),
      diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "boo" }),
      markdownShortcutPlugin(),
    ]}
  />
);

export default Markdown;
