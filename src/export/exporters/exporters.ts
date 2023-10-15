import { ExportedProject } from '../exportedProject';
import { exportUixjs } from './uixjs/exportUixjs';
import { ProjectData } from '../projectData';

interface Exporter {
  id: string;
  name: string;
  active: boolean;
  export: ((projectData: ProjectData, exportedProject: ExportedProject) => Promise<void>) | null;
}

const EXPORTERS: Exporter[] = [
  {
    id: 'uixjs',
    name: 'Uix.js',
    active: true,
    export: exportUixjs
  },
  {
    id: 'react',
    name: 'React',
    active: false,
    export: null
  },
  {
    id: 'vue',
    name: 'Vue 3',
    active: false,
    export: null
  },
  {
    id: 'svelte',
    name: 'Svelte',
    active: false,
    export: null
  },
  {
    id: 'angular',
    name: 'Angular',
    active: false,
    export: null
  }
];

export { EXPORTERS, Exporter };
