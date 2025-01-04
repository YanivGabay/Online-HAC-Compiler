import { Group, Text, Button, Container, useMantineTheme } from "@mantine/core";
import { IconBrandGithub, IconHeart } from '@tabler/icons-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const theme = useMantineTheme();

  return (
    <Container 
      h="100%" 
      py={{ base: 'xs', sm: 'md' }}
      px="md"
    >
      <Group 
        justify="space-between" 
        h="100%"
        wrap="wrap-reverse"
        gap="sm"
      >
        <Text 
          size="sm" 
          c="brand.7"
        >
          © {currentYear} C/C++ Online Compiler
        </Text>

        <Group gap="xs" wrap="nowrap">
          <Button
            component="a"
            href="https://github.com/YanivGabay/Online-HAC-Compiler"
            target="_blank"
            leftSection={<IconBrandGithub size={16} />}
            variant="light"
            color="brand"
          >
            Github
          </Button>
          <Button
            component="a"
            href="https://github.com/sponsors/your-actual-username"
            target="_blank"
            leftSection={<IconHeart size={16} style={{ color: theme.colors.red[6] }} />}
            variant="light"
            color="red"
          >
            Support Us
          </Button>
        </Group>
      </Group>
    </Container>
  );
} 