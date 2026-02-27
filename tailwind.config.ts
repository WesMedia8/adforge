import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'af-bg-primary': 'var(--bg-primary)',
        'af-bg-secondary': 'var(--bg-secondary)',
        'af-bg-tertiary': 'var(--bg-tertiary)',
        'af-bg-elevated': 'var(--bg-elevated)',
        'af-bg-hover': 'var(--bg-hover)',
        'af-border-subtle': 'var(--border-subtle)',
        'af-border-default': 'var(--border-default)',
        'af-border-bright': 'var(--border-bright)',
        'af-text-primary': 'var(--text-primary)',
        'af-text-secondary': 'var(--text-secondary)',
        'af-text-tertiary': 'var(--text-tertiary)',
        'af-accent': 'var(--accent)',
        'af-accent-hover': 'var(--accent-hover)',
        'af-accent-subtle': 'var(--accent-subtle)',
        'af-accent-glow': 'var(--accent-glow)',
        'af-success': 'var(--success)',
        'af-danger': 'var(--danger)',
      },
      fontFamily: {
        ui: ['var(--font-ui)'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
    },
  },
  plugins: [],
};

export default config;
