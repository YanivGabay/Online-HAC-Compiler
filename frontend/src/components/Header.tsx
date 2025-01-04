import { Group, SegmentedControl, Button } from "@mantine/core";
import { IconPlayerPlay, IconLoader2 } from '@tabler/icons-react';
import { CompilerType } from '../services/compilerService';

interface HeaderProps {
  compiler: CompilerType;
  onCompilerChange: (value: CompilerType) => void;
  onCompile: () => void;
  isCompiling: boolean;
}

export function Header({ compiler, onCompilerChange, onCompile, isCompiling }: HeaderProps) {
  return (
    <Group justify="space-between">
      <SegmentedControl
        value={compiler}
        onChange={(value) => onCompilerChange(value as CompilerType)}
        data={[
          { label: 'C (GCC 8.5.0)', value: 'gcc' },
          { label: 'C++ (G++ 8.5.0)', value: 'g++' }
        ]}
        disabled={isCompiling}
      />
      <Button 
        onClick={onCompile}
        disabled={isCompiling}
        leftSection={
          isCompiling 
            ? <IconLoader2 className="mantine-spin" /> 
            : <IconPlayerPlay size={14} />
        }
      >
        {isCompiling ? 'Compiling...' : 'Compile & Run'}
      </Button>
    </Group>
  );
} 