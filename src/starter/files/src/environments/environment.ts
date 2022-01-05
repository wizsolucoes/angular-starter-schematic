// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  ssoConfig: {
    apiPath: '<<urldo servico>>',
    clientID: '<<Cliente ID>>',
    clientSecret: '<<Cliente Secret>>',
    grantType: '<<Grant Type>>',
    authedPaths: ['<<dns a ser autenticado>>'],
    scope: '<<scope do projeto>>',
    options: {
      // parâmetro opcional
      ssoTimeOut: 60000, // parâmetro opcional, determina o timeout para o SSO
      tokenAutoRefresh: true, // parâmetro opcional, determina se o token deve ser renovado
      loginRoute: 'login', // url que aponta para onde redirecionar no caso de não haver token
    },
  },
  appInsights: {
    instrumentationKey: '',
  },
  reCaptcha: {
    siteKey: 'YOUR-RECAPTCHA-KEY',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
