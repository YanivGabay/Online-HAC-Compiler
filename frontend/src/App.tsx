import "@mantine/core/styles.css";
import { MantineProvider, AppShell, Paper, Group, Stack, LoadingOverlay, Textarea, ColorSchemeScript, Container, SimpleGrid } from "@mantine/core";
import { theme } from "./theme";
import { useState, Suspense } from "react";
import { Header } from "./components/Header";
import { CodeEditor } from "./components/CodeEditor";
import { OutputPanel } from "./components/OutputPanel";
import { Footer } from "./components/Footer";
import { compileAndRun, CompilerType, CompilationStatus } from "./services/compilerService";
import { codeTemplates } from './constants/codeTemplates';

export default function App() {
  const [code, setCode] = useState(codeTemplates['g++']);
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

  const handleCompilerChange = (newCompiler: CompilerType) => {
    const oldCode = code;
    const oldCompiler = compiler;
    if(oldCode === codeTemplates[oldCompiler]) {
      setCode(codeTemplates[newCompiler]);
    }
    setCompiler(newCompiler);
  };

  return (
    <>
      <ColorSchemeScript />
      <MantineProvider theme={theme} defaultColorScheme="light">
        <AppShell
          header={{ height: { base: 100, sm: 80 } }}
          footer={{ height: 50 }}
          padding="md"
          style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
        >
          <AppShell.Header>
            <Container size="xl" h="100%" py={{ base: 'xs', sm: 'md' }}>
              <Header
                compiler={compiler}
                onCompilerChange={handleCompilerChange}
                onCompile={handleCompile}
                isCompiling={isCompiling}
              />
            </Container>
          </AppShell.Header>

          <AppShell.Main>
            <Container size="xl" py="md">
              <Stack gap="md">
                <Paper shadow="sm" radius="md" withBorder p="md" style={{ height: "60vh", position: "relative" }}>
                  <Suspense fallback={<LoadingOverlay visible />}>
                    <CodeEditor 
                      code={code}
                      compiler={compiler}
                      onChange={(value) => setCode(value || "")}
                    />
                  </Suspense>
                </Paper>

                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                  <Paper shadow="sm" radius="md" withBorder p="md">
                    <Textarea
                      label="Standard Input (stdin)"
                      placeholder="Enter program input here..."
                      value={stdin}
                      onChange={(event) => setStdin(event.currentTarget.value)}
                      minRows={3}
                      maxRows={5}
                      styles={{
                        label: { marginBottom: 8 },
                        input: { fontFamily: 'monospace' }
                      }}
                    />
                  </Paper>

                  <Stack gap="md">
                    <OutputPanel
                      title="Compilation Output"
                      content={
                        result?.status === 'completed' || result?.status === 'failed' 
                          ? (result?.result?.compilationOutput || result?.result?.error)
                          : undefined
                      }
                      placeholder="No compilation messages"
                      isError={!result?.result?.success}
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
                  </Stack>
                </SimpleGrid>
              </Stack>
            </Container>
          </AppShell.Main>

          <AppShell.Footer>
            <Footer />
          </AppShell.Footer>
        </AppShell>
      </MantineProvider>
    </>
  );
}
