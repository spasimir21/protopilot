import { registerTabComponents } from './components/tabs/tabs';
import rootComponent from './components/root/root.component';
import { createRegistry } from '@uixjs/core';

const protoPilotRegistry = createRegistry('proto');

registerTabComponents(protoPilotRegistry);

protoPilotRegistry.components.register(rootComponent);
