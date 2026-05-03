import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    'agent-skills',
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/file-rules',
        'api/class-rules',
        'api/function-rules',
        'api/property-rules',
        'api/layered-architecture',
        'api/slices',
      ],
    },
  ],
};

export default sidebars;
