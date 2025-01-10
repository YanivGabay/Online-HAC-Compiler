import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'brand',
  fontFamily: 'Inter, sans-serif',
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        size: 'sm',
        variant: 'filled',
      },
      styles: {
        root: {
          transition: 'transform 0.2s ease',
          '&:hover:not(:disabled)': {
            transform: 'translateY(-1px)',
          }
        }
      }
    },
    Paper: {
      defaultProps: {
        p: 'md',
        shadow: 'sm',
      },
      styles: {
        root: {
          transition: 'box-shadow 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          }
        }
      }
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  breakpoints: {
    xs: '36em',    // 576px
    sm: '48em',    // 768px
    md: '62em',    // 992px
    lg: '75em',    // 1200px
    xl: '88em',    // 1408px
  },
  colors: {
    brand: [
      '#E3F2FD', // 0: Lightest - Background
      '#BBDEFB', // 1
      '#90CAF9', // 2
      '#64B5F6', // 3
      '#42A5F5', // 4
      '#2196F3', // 5: Primary
      '#1E88E5', // 6
      '#1976D2', // 7
      '#1565C0', // 8
      '#0D47A1', // 9: Darkest
    ],
    dark: [
      '#C1C2C5', // 0
      '#A6A7AB', // 1
      '#909296', // 2
      '#5C5F66', // 3
      '#373A40', // 4
      '#2C2E33', // 5
      '#25262B', // 6: Editor background
      '#1A1B1E', // 7
      '#141517', // 8
      '#101113', // 9
    ],
    success: [
      '#E8F5E9',
      '#C8E6C9',
      '#A5D6A7',
      '#81C784',
      '#66BB6A',
      '#4CAF50',  // Primary success
      '#43A047',
      '#388E3C',
      '#2E7D32',
      '#1B5E20',
    ],
  },
});
