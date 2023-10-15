import rootComponent from './components/root/root.component';
import { createRegistry } from '@uixjs/core';
import { registerPages } from './pages';

const $PROJECT_NAMESPACE$Registry = createRegistry('$PROJECT_NAMESPACE$');
registerPages($PROJECT_NAMESPACE$Registry);

$PROJECT_NAMESPACE$Registry.components.register(rootComponent);
