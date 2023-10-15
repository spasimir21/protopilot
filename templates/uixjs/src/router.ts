import { Router } from '@uixjs/router';
import { Registry } from '@uixjs/core';

function createRouter(registry: Registry) {
  return new Router([
$ROUTES$
  ]);
}

export { createRouter };
