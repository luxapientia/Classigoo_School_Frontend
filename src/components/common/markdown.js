import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // Make sure to import KaTeX styles

export default function MarkdownRender({ children }) {
  return (
    <ReactMarkdown
      children={children}
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
    />
  );
}
