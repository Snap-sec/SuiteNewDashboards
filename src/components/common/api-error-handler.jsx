import React from 'react';
import { Error403 } from '../../pages/error/403-error';
import { Error404 } from '../../pages/error/404-error';
import { Error500 } from '../../pages/error/500-error';
import { MaintenanceError } from '../../pages/error/mantainenece-error';

/**
 * Global API error handler component.
 * Accepts an `error` prop with the shape:
 * {
 *   status: number,
 *   data: { message?: string, ... }
 * }
 * Uses a switch on the outer `status` key to render the appropriate error page.
 * Defaults to `Error500` for any unknown status.
 */
export function ApiErrorHandler({ error }) {
  const status =
    typeof error === 'number'
      ? error
      : (error?.status ?? error?.originalStatus);

  switch (status) {
    case 404:
    case '404':
      return <Error404 />;

    case 403:
    case '403':
      return <Error403 />;

    case 500:
    case '500':
      return (
        <div>
          <Error500 />
        </div>
      );

    default:
      return <MaintenanceError />;
  }
}

export default ApiErrorHandler;
