import { Editor } from "@monaco-editor/react";
import { CompilerType } from '../services/compilerService';

interface CodeEditorProps {
  code: string;
  compiler: CompilerType;
  onChange: (value: string | undefined) => void;
}

export function CodeEditor({ code, compiler, onChange }: CodeEditorProps) {
  const language = compiler === 'gcc' ? 'c' : 'cpp';

  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      language={language}
      value={code}
      onChange={onChange}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
      }}
    />
  );
} 