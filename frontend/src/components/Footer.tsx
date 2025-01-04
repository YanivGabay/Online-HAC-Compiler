import { Group, Text, Button } from "@mantine/core";
import { IconBrandGithub, IconHeart } from '@tabler/icons-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div style={{ height: '100%', padding: 'md' }}>
      <Group justify="space-between" h="100%">
        <Text size="sm">© {currentYear} C/C++ Online Compiler</Text>
        <Group gap="xs" justify="flex-end" align="center">
          <Button
            component="a"
            href="https://github.com/YanivGabay/Online-HAC-Compiler"
            target="_blank"
            leftSection={<IconBrandGithub size={16} />}
            variant="light"
            size="sm"
          >
            GitHub
          </Button>
          <Button
            component="a"
            href="https://github.com/sponsors/your-actual-username"
            target="_blank"
            leftSection={<IconHeart size={16} style={{ color: '#FF0000' }} />}
            variant="light"
            color="pink"
            size="sm"
          >
            Support Us
          </Button>
        </Group>
      </Group>
    </div>
  );
} 