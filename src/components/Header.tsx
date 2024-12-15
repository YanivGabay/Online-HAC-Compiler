import { Group, Title, Select, Button } from "@mantine/core";
import { IconPlayerPlay, IconLoader2 } from '@tabler/icons-react';
import { CompilerType } from '../services/compilerService';

interface HeaderProps {
  compiler: CompilerType;
  onCompilerChange: (value: string | null) => void;
  onCompile: () => void;
  isCompiling: boolean;
}

export function Header({ compiler, onCompilerChange, onCompile, isCompiling }: HeaderProps) {
  return (
    <Group justify="space-between">
      <Title order={3}>C/C++ Online Compiler</Title>
      <Group>
        <Select
          value={compiler}
          onChange={onCompilerChange}
          data={[
            { value: "g++", label: "C++ (G++ 8.5.0)" },
            { value: "gcc", label: "C (GCC 8.5.0)" },
          ]}
          placeholder="Select compiler"
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