import { Paper } from "@mantine/core";
import Editor from "@monaco-editor/react";
import { CompilerType } from '../services/compilerService';

interface CodeEditorProps {
  code: string;
  compiler: CompilerType;
  onChange: (value: string | undefined) => void;
}

export function CodeEditor({ code, compiler, onChange }: CodeEditorProps) {
  const language = compiler === 'gcc' ? 'c' : 'cpp';

  return (
    <Paper 
      h="100%" 
      style={{ overflow: 'hidden' }}
      bg="dark.7"
    >
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        value={code}
        onChange={onChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </Paper>
  );
} 