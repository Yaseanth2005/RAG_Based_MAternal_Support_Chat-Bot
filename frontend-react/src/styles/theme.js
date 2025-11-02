import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800',
        lineHeight: 'base',
      },
    }),
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'md',
      },
      variants: {
        solid: (props) => ({
          bg: 'primary.500',
          color: 'white',
          _hover: {
            bg: 'primary.600',
            _disabled: {
              bg: 'primary.500',
            },
          },
          _active: {
            bg: 'primary.700',
          },
        }),
      },
      defaultProps: {
        variant: 'solid',
      },
    },
    Input: {
      baseStyle: {
        field: {
          _focus: {
            borderColor: 'primary.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
          },
        },
      },
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

export default theme;
