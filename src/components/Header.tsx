import { Group, Title, Select, Button } from "@mantine/core";
import { IconPlayerPlay, IconLoader2 } from '@tabler/icons-react';

interface HeaderProps {
  language: string;
  onLanguageChange: (value: string | null) => void;
  onCompile: () => void;
  isCompiling: boolean;
}

export function Header({ language, onLanguageChange, onCompile, isCompiling }: HeaderProps) {
  return (
    <Group justify="space-between">
      <Title order={3}>C/C++ Online Compiler</Title>
      <Group>
        <Select
          value={language}
          onChange={(value) => onLanguageChange(value)}
          data={[
            { value: "cpp", label: "C++ (G++ 8.5.0)" },
            { value: "c", label: "C (GCC 8.5.0)" },
          ]}
          placeholder="Select language"
          disabled={isCompiling}
        />
        <Button 
          onClick={onCompile} 
          color="blue"
          disabled={isCompiling}
          leftSection={isCompiling ? <IconLoader2 className="mantine-spin" /> : <IconPlayerPlay size={14} />}
        >
          {isCompiling ? 'Compiling...' : 'Compile & Run'}
        </Button>
      </Group>
    </Group>
  );
} 