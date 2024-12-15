import "@mantine/core/styles.css";
import { MantineProvider, AppShell, Paper, Group, Stack, LoadingOverlay, Textarea } from "@mantine/core";
import { theme } from "./theme";
import { useState, Suspense } from "react";
import { Header } from "./components/Header";
import { CodeEditor } from "./components/CodeEditor";
import { OutputPanel } from "./components/OutputPanel";
import { Footer } from "./components/Footer";
import { compileAndRun, CompilerType } from "./services/compilerService";

export default function App() {
  const [code, setCode] = useState("#include <iostream>\n\nint main() {\n    std::cout << \"Hello, World!\" << std::endl;\n    return 0;\n}");
  const [compiler, setCompiler] = useState<CompilerType>('g++');
  const [stdin, setStdin] = useState("");
  const [compileOutput, setCompileOutput] = useState("");
  const [programOutput, setProgramOutput] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);

  const handleCompile = async () => {
    setIsCompiling(true);
    setCompileOutput("Compiling...");
    setProgramOutput("");

    try {
      const result = await compileAndRun(code, compiler, stdin);
      
      setCompileOutput(result.compilationOutput);
      if (result.success && result.programOutput) {
        setProgramOutput(result.programOutput);
      }
    } catch (error) {
      setCompileOutput(error instanceof Error ? error.message : 'An error occurred');
      setProgramOutput("");
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
                content={compileOutput}
                placeholder="No compilation messages"
                isError={true}
                loading={isCompiling}
              />
              <OutputPanel
                title="Program Output"
                content={programOutput}
                placeholder="Program hasn't been run yet"
                loading={isCompiling}
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
