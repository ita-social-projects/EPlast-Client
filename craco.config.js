const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#3c5438",
              "@layout-header-background": "#3c5438",
              "@layout-footer-background": "#3c5438",
              "@layout-sider-background": "#3c5438",
              "@menu-dark-item-hover-bg": "transparent",
              "@menu-bg": "#3c5438",
              "@menu-item-active-border-width": "none",
              "@dropdown-menu-bg": "#3c5438",
              "@menu-dark-submenu-bg": "#3c5438",
              "@layout-trigger-background": "#3c5438",
              "@tooltip-bg": "#3c5438",
              "@item-hover-bg": "transparent",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
