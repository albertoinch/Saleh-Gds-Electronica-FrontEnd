// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const config = {
  production: false, // Valores posibles true / false
  campoNombreLdap: 'username',
  campoPasswordLdap: 'password',
  tipoJWTLdap: 'JWT',
  apiAuth: 'http://localhost:3000/autenticar', // Url donde se valida la autenticación del usuario
  apiUrl: 'http://localhost:3000/api/v1/' // Url de la API REST del proyecto
};
