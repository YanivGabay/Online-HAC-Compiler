import { Paper, Title, Text, LoadingOverlay } from "@mantine/core";

interface OutputPanelProps {
  title: string;
  content: string;
  placeholder: string;
  isError?: boolean;
  loading?: boolean;
}

export function OutputPanel({ title, content, placeholder, isError, loading }: OutputPanelProps) {
  return (
    <Paper shadow="xs" p="md" style={{ position: 'relative' }}>
      <LoadingOverlay visible={loading || false} />
      <Title order={4} mb="sm">{title}</Title>
      <Paper bg="gray.1" p="md" style={{ minHeight: "150px" }}>
        <Text c={isError && content.includes("error") ? "red" : "dimmed"} style={{ whiteSpace: "pre-wrap" }}>
          {content || placeholder}
        </Text>
      </Paper>
    </Paper>
  );
} 