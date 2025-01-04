import { Paper, Title, Text, LoadingOverlay } from "@mantine/core";

interface OutputPanelProps {
  title: string;
  content?: string;
  placeholder: string;
  loading?: boolean;
  isError?: boolean;
  status?: 'queued' | 'compiling' | 'completed' | 'failed';
}

export function OutputPanel({ title, content, placeholder, loading, isError, status }: OutputPanelProps) {
  const getDisplayText = () => {
    if (status === 'queued') return 'Waiting in queue...';
    if (status === 'compiling') return 'Compiling...';
    if (status === 'failed' && !content) return 'Execution failed';
    if (!content) return placeholder;
    return content;
  };

  const getTextColor = () => {
    if (status === 'failed') return "red.7";
    if (content && isError && content.includes("error")) return "red.7";
    if (status === 'completed' && !isError) return "success.7";
    return "brand.7";
  };

  return (
    <Paper shadow="xs" p="md" style={{ position: 'relative' }}>
      <LoadingOverlay 
        visible={loading || false}
        loaderProps={{ color: 'brand' }}
        overlayProps={{ blur: 2 }}
      />
      <Title order={4} mb="sm" c="brand.7">{title}</Title>
      <Paper bg="dark.7" p="md" style={{ minHeight: "150px" }}>
        <Text c={getTextColor()} style={{ whiteSpace: "pre-wrap" }}>
          {getDisplayText()}
        </Text>
      </Paper>
    </Paper>
  );
} 