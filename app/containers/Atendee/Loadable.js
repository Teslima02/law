/**
 *
 * Asynchronously loads the component for Atendee
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
