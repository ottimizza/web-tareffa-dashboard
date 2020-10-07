import { ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from './global-error-handler';

export const GlobalErrorHandlerProvider = {
  provide: ErrorHandler,
  useClass: GlobalErrorHandler
};
