import { Group, SegmentedControl, Button, Container, Title, Stack } from "@mantine/core";
import { IconPlayerPlay, IconLoader2 } from '@tabler/icons-react';
import { CompilerType } from '../services/compilerService';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  compiler: CompilerType;
  onCompilerChange: (value: CompilerType) => void;
  onCompile: () => void;
  isCompiling: boolean;
}

export function Header({ compiler, onCompilerChange, onCompile, isCompiling }: HeaderProps) {
  return (
    <Container py={{ base: 'xs', sm: 'md' }}>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Title order={2} c="brand.7">Online HAC Compiler</Title>
          <ThemeToggle />
        </Group>
        <Group justify="space-between" wrap="wrap" gap="sm">
          <SegmentedControl
            value={compiler}
            onChange={(value) => onCompilerChange(value as CompilerType)}
            data={[
              { label: 'C (GCC 8.5.0)', value: 'gcc' },
              { label: 'C++ (G++ 8.5.0)', value: 'g++' }
            ]}
            disabled={isCompiling}
            color="brand"
          />
          <Button 
            onClick={onCompile}
            disabled={isCompiling}
            leftSection={
              isCompiling 
                ? <IconLoader2 className="mantine-spin" /> 
                : <IconPlayerPlay size={14} />
            }
            color="brand"
          >
            {isCompiling ? 'Compiling...' : 'Compile & Run'}
          </Button>
        </Group>
      </Stack>
    </Container>
  );
} 