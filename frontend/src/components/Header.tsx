import { Container, Group, Select, Button, Stack, Title } from '@mantine/core';
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
    <Container h="100%" py="md">
      <Stack gap="xs" justify="center" h="100%">
        <Group justify="space-between" wrap="nowrap">
          <Title order={2} c="brand.7" size="h3">Online HAC Compiler</Title>
          <ThemeToggle />
        </Group>
        <Group justify="space-between" wrap="nowrap">
          <Group wrap="nowrap" gap="sm">
            <Select
              size="sm"
              value={compiler}
              onChange={(value) => onCompilerChange(value as CompilerType)}
              data={[
                { value: 'gcc', label: 'C (GCC 8.5.0)' },
                { value: 'g++', label: 'C++ (G++ 8.5.0)' },
              ]}
              style={{ minWidth: 180 }}
              disabled={isCompiling}
              color="brand"
            />
            <Button
              leftSection={
                isCompiling 
                  ? <IconLoader2 className="mantine-spin" /> 
                  : <IconPlayerPlay size={16} />
              }
              onClick={onCompile}
              loading={isCompiling}
              disabled={isCompiling}
              size="sm"
              color="brand"
            >
              {isCompiling ? 'Compiling...' : 'Compile & Run'}
            </Button>
          </Group>
        </Group>
      </Stack>
    </Container>
  );
} 