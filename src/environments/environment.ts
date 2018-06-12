// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyD3LUCvY13k2gGF4AGXH_D4XyHdgF1vqVA",
    authDomain: "ng-fitness-log.firebaseapp.com",
    databaseURL: "https://ng-fitness-log.firebaseio.com",
    projectId: "ng-fitness-log",
    storageBucket: "ng-fitness-log.appspot.com",
    messagingSenderId: "1011324218036"
  },
  algolia: {
    appId: 'Y0U3KHVP6S',
    apiKey: '1ae4d785cf7d7b4c149badbb5a2b81a2'
  }
};
