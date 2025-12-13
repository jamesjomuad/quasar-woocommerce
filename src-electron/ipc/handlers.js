import { registerUserHandlers, registerAuthHandlers, registerProductHandlers } from './handlers/index.js';

/**
 * Setup all IPC handlers by registering each handler module
 */
export function setupIPCHandlers() {
  console.log('🔧 Registering IPC Handlers...');

  // Register all handler modules
  registerUserHandlers();
  registerAuthHandlers();
  registerProductHandlers();

  console.log('✅ IPC Handlers registered.');
}
