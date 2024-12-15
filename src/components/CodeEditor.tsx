import Editor, { OnMount } from "@monaco-editor/react";
import { useRef } from "react";

interface CodeEditorProps {
  code: string;
  onChange: (value: string | undefined) => void;
}

export function CodeEditor({ code, onChange }: CodeEditorProps) {
  const editorRef = useRef(null);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <Editor
      height="100%"
      defaultLanguage="cpp"
      value={code}
      onChange={onChange}
      onMount={handleEditorDidMount}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
      }}
    />
  );
} 