import "@mantine/core/styles.css";
import { MantineProvider, AppShell, Paper, Group, Stack, LoadingOverlay } from "@mantine/core";
import { theme } from "./theme";
import { useState, Suspense } from "react";
import { Header } from "./components/Header";
import { CodeEditor } from "./components/CodeEditor";
import { OutputPanel } from "./components/OutputPanel";
import { Footer } from "./components/Footer";
import { compileAndRun } from "./services/compilerService";

export default function App() {
  const [code, setCode] = useState("#include <iostream>\n\nint main() {\n    std::cout << \"Hello, World!\" << std::endl;\n    return 0;\n}");
  const [language, setLanguage] = useState("cpp");
  const [compileOutput, setCompileOutput] = useState("");
  const [programOutput, setProgramOutput] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);

  const handleCompile = async () => {
    setIsCompiling(true);
    setCompileOutput("Compiling...");
    setProgramOutput("");

    try {
      const result = await compileAndRun(code, language);
      
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
      >
        <AppShell.Header p="md">
          <Header 
            language={language}
            onLanguageChange={(value) => setLanguage(value || "cpp")}
            onCompile={handleCompile}
            isCompiling={isCompiling}
          />
        </AppShell.Header>

        <AppShell.Main>
          <Stack gap="md">
            <Paper shadow="xs" p="md" style={{ height: "400px", position: "relative" }}>
              <Suspense fallback={<LoadingOverlay visible />}>
                <CodeEditor 
                  code={code}
                  onChange={(value) => setCode(value || "")}
                />
              </Suspense>
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

        <AppShell.Footer>
          <Footer />
        </AppShell.Footer>
      </AppShell>
    </MantineProvider>
  );
}
