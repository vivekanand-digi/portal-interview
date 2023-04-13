import { MsalAuthProvider, LoginType } from 'react-aad-msal'
import { Logger, LogLevel } from 'msal'
import { Auth } from '../../Constants/constants'

export const authProvider = new MsalAuthProvider(
  {
    auth: {
      authority: Auth.authority,
      clientId: Auth.clientId,
      postLogoutRedirectUri: window.location.origin,
      redirectUri: window.location.origin,
      validateAuthority: true,
      navigateToLoginRequestUrl: false,
      grant_type: 'authorization_code',
      scope: '.default'
    },
    system: {
      logger: new Logger((logLevel, message, containsPii) => {}, {
        level: LogLevel.Verbose,
        piiLoggingEnabled: false
      })
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: true
    }
  },
  {
    scopes: ['https://graph.microsoft.com/calendars.read', 'https://graph.microsoft.com/mail.send']
  },
  {
    loginType: LoginType.Redirect,
    tokenRefreshUri: window.location.origin + '/auth.html'
  }
)
