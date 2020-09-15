// Allows deep-import warnings to be ignored
// https://github.com/angular/angular/pull/35683

module.exports = {
  packages: {
    '@wizsolucoes/ngx-wiz-sso': {
      ignorableDeepImportMatchers: [
        /@angular\//,
      ]
    },
  },
};