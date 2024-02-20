import '@appmaker-xyz/plugins';
import '@appmaker-xyz/shopify-core-theme';
import '@appmaker-packages/theme-mcaffeine';
import { activateLocalTheme, activateLocalExtension } from '@appmaker-xyz/core';

// Import packages here
// import '@appmaker-partners/<package-name>';

import '@appmaker-packages/extension-pop-coins';

activateLocalExtension({ id: 'pop-coins', settings: {} });

// activateLocalTheme({
//   id: 'custom-160723-mcaffeine',
//   tag: 'custom-160723-mcaffeine',
//   settings: {},
// });
