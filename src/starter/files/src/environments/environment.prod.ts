export const environment = {
  production: true,
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
    instrumentationKey: 'YOUR-APPLICATION-INSIGHTS-INSTRUMENTATION-KEY',
  },
  reCaptcha: {
    siteKey: 'YOUR-RECAPTCHA-KEY',
  },
};
