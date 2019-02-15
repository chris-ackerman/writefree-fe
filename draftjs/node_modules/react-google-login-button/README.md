# React Google Login Button

This component renders the Google Login button as per the [Google docs](https://developers.google.com/identity/sign-in/web/sign-in). Only difference is it is adapted for use in a React component.

Check out [the Demo!](https://ljtijhuis.github.io/react-google-login-button/).

## Parameters

| Key | Required / optional | Type | Default |
|-----|---------------------|------|---------|
| googleClientId | required | string | - |
| onLoginSuccess | required | function | - |
| onLoginFailure | required | function | - |
| width | optional | number | 140 |
| height  | optional | number | 40 |
| longTitle | optional | boolean | false |
| theme | optional | string: 'light' / 'dark' | light |

## Usage

Snippet:
```javascript
import GoogleLoginButton from 'react-google-login-button'

[...]

  render() {
    return (
      <GoogleLoginButton
        googleClientId='YOUR_GOOGLE_CLIENT_ID_HERE'
        onLoginSuccess={(googleUser) => {
          console.log('Replace this function to start using this information');
          console.log('Google User:', googleUser.getBasicProfile());
          console.log('ID token:', googleUser.getAuthResponse().id_token);
        })}
        onLoginFailure={() => console.log('Login failed')}
        width={140}
        height={40}
        longTitle={false}
        theme="light"
      />    
    );
  }
  
[...]
```

## References

  * [Gapi reference](https://developers.google.com/identity/sign-in/web/reference)
  * [Button rendering params reference](https://developers.google.com/identity/sign-in/web/reference#gapisignin2renderid-options)
  * [Use the ID token for authentication on your backend](https://developers.google.com/identity/sign-in/web/backend-auth)