import type { Core } from '@strapi/strapi';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  // register phase
  strapi.customFields.register({
    name: 'emceeProduct', // The name of your custom field
    plugin: 'emcee', // The plugin name
    type: 'string', // Must be an existing Strapi data type
    inputSize: {
      // Optional: controls field width in admin
      default: 4,
      isResizable: true,
    },
  });

  strapi.customFields.register({
    name: 'emceeBrand',
    plugin: 'emcee',
    type: 'string',
  });

  strapi.customFields.register({
    name: 'emceeCategory',
    plugin: 'emcee',
    type: 'string',
  });
};

export default register;
