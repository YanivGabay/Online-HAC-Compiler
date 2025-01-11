import { Paper, Title, Text, LoadingOverlay, useMantineColorScheme } from "@mantine/core";

interface OutputPanelProps {
  title: string;
  content?: string;
  placeholder: string;
  loading?: boolean;
  isError?: boolean;
  status?: 'queued' | 'compiling' | 'completed' | 'failed';
}

export function OutputPanel({ title, content, placeholder, loading, isError, status }: OutputPanelProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

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
    return isDark ? "dimmed" : "dark.6";
  };

  return (
    <Paper shadow="sm" radius="md" withBorder p="md" style={{ position: 'relative' }}>
      <LoadingOverlay 
        visible={loading || false}
        loaderProps={{ color: 'brand' }}
        overlayProps={{ blur: 2 }}
      />
      <Title order={5} mb="sm" c="brand.7">{title}</Title>
      <Paper 
        bg={isDark ? "dark.7" : "gray.1"}
        p="md" 
        radius="sm"
        style={{ 
          minHeight: "120px",
          maxHeight: "200px",
          overflow: 'auto'
        }}
      >
        <Text 
          c={getTextColor()} 
          style={{ 
            whiteSpace: "pre-wrap",
            fontFamily: 'monospace',
            fontSize: '0.9rem'
          }}
        >
          {getDisplayText()}
        </Text>
      </Paper>
    </Paper>
  );
} 