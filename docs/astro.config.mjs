import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'next-international',
      social: {
        github: 'https://github.com/QuiiBz/next-international',
      },
      sidebar: [
        {
          label: 'Get Started',
          link: '/get-started',
        },
        {
          label: 'App Router',
          autogenerate: {
            directory: 'app',
          },
        },
        {
          label: 'Pages Router',
          autogenerate: {
            directory: 'pages',
          },
        },
      ],
    }),
  ],

  // Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
