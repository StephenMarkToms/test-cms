import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';

export default {
  register(app: any) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: PLUGIN_ID,
      },
      Component: async () => {
        const { App } = await import('./pages/App');

        return App;
      },
    });

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });

    app.customFields.register({
      name: 'emceeProduct',
      pluginId: 'emcee',
      type: 'string',
      intlLabel: {
        id: 'emcee.emceeProduct.label',
        defaultMessage: 'Product',
      },
      intlDescription: {
        id: 'emcee.emceeProduct.description',
        defaultMessage: 'Product field',
      },
      icon: PluginIcon, // You need to provide an icon component
      components: {
        Input: async () =>
          import(/* webpackChunkName: "input-component" */ './components/ProductInput'),
      },
      options: {
        // Optional: declare options for the Content-type Builder
      },
    });

    app.customFields.register({
      name: 'emceeBrand',
      pluginId: 'emcee',
      type: 'string',
      intlLabel: {
        id: 'emcee.emceeBrand.label',
        defaultMessage: 'Brand',
      },
      intlDescription: {
        id: 'emcee.emceeBrand.description',
        defaultMessage: 'Brand field',
      },
      icon: PluginIcon, // You need to provide an icon component
      components: {
        Input: async () =>
          import(/* webpackChunkName: "input-component" */ './components/BrandInput'),
      },
      options: {
        // Optional: declare options for the Content-type Builder
      },
    });

    app.customFields.register({
      name: 'emceeCategory',
      pluginId: 'emcee',
      type: 'string',
      intlLabel: {
        id: 'emcee.emceeCategory.label',
        defaultMessage: 'Category',
      },
      intlDescription: {
        id: 'emcee.emceeCategory.description',
        defaultMessage: 'Category field',
      },
      icon: PluginIcon, // You need to provide an icon component
      components: {
        Input: async () =>
          import(/* webpackChunkName: "input-component" */ './components/CategoryInput'),
      },
      options: {
        // Optional: declare options for the Content-type Builder
      },
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
