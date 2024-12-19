import "@mantine/core/styles.css";
import { MantineProvider, AppShell, Paper, Group, Stack, LoadingOverlay, Textarea } from "@mantine/core";
import { theme } from "./theme";
import { useState, Suspense } from "react";
import { Header } from "./components/Header";
import { CodeEditor } from "./components/CodeEditor";
import { OutputPanel } from "./components/OutputPanel";
import { Footer } from "./components/Footer";
import { compileAndRun, CompilerType, CompilationStatus } from "./services/compilerService";

export default function App() {
  const [code, setCode] = useState(`#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`);
  const [stdin, setStdin] = useState('');
  const [compiler, setCompiler] = useState<CompilerType>('g++');
  const [isCompiling, setIsCompiling] = useState(false);
  const [result, setResult] = useState<CompilationStatus | null>(null);

  const handleCompile = async () => {
    try {
      setIsCompiling(true);
      setResult(null);

      const status = await compileAndRun(code, compiler, stdin);
      setResult(status);

    } catch (error) {
      setResult({
        requestId: '',
        status: 'failed',
        result: {
          success: false,
          compilationOutput: 'Error occurred',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <MantineProvider theme={theme}>
      <AppShell
        header={{ height: 60 }}
        footer={{ height: 60 }}
        padding="md"
        style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <AppShell.Header p="md">
          <Header 
            compiler={compiler}
            onCompilerChange={(value) => setCompiler(value as CompilerType)}
            onCompile={handleCompile}
            isCompiling={isCompiling}
          />
        </AppShell.Header>

        <AppShell.Main style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: '60px' }}>
          <Stack gap="md" style={{ flex: 1 }}>
            <Paper shadow="xs" p="md" style={{ height: "400px", position: "relative" }}>
              <Suspense fallback={<LoadingOverlay visible />}>
                <CodeEditor 
                  code={code}
                  onChange={(value) => setCode(value || "")}
                />
              </Suspense>
            </Paper>

            <Paper shadow="xs" p="md">
              <Textarea
                label="Standard Input (stdin)"
                placeholder="Enter program input here..."
                value={stdin}
                onChange={(event) => setStdin(event.currentTarget.value)}
                minRows={2}
                maxRows={4}
              />
            </Paper>

            <Group grow align="flex-start">
              <OutputPanel
                title="Compilation Output"
                content={
                  result?.status === 'completed' || result?.status === 'failed' 
                    ? (result?.result?.error || result?.result?.compilationOutput)
                    : undefined
                }
                placeholder="No compilation messages"
                isError={true}
                loading={isCompiling}
                status={result?.status}
              />
              <OutputPanel
                title="Program Output"
                content={result?.result?.programOutput}
                placeholder="Program hasn't been run yet"
                loading={isCompiling}
                status={result?.status}
              />
            </Group>
          </Stack>
        </AppShell.Main>

        <AppShell.Footer style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 100 }}>
          <Footer />
        </AppShell.Footer>
      </AppShell>
    </MantineProvider>
  );
}
