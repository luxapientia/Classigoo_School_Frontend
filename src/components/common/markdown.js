import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css"; // Make sure to import KaTeX styles

export default function MarkdownRender({ children }) {
  return (
    <div className="markdown-body overflow-hidden overflow-x-auto">
      <ReactMarkdown
        children={children}
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
      />
    </div>
  );
}
