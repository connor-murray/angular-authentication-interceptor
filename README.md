# Angular Authentication Interceptor

## Client
The URLs defined within the `isAuthenticatedRequest` function should be updated to include any token or token refresh requests i.e. `/oauth/token`


## Server
Simple mock server exposing three endpoints in order to demonstrate use of the authentication interceptor. It has no authentication or authorization implemented.

Every third request to the `/todos` endpoint (click todos button) will return a 401. This it to demonstrate the refresh token logic within the interceptor.

Every request to `/fail` endpoint (click get 401 button) will return a 401. Therefore clicking this will result in logout.


## Steps

### Successful Token Refresh
 - open console debug window
 - click `get todos` button three times
 - third request will return 401
 - interceptor will queue failed request and make request to refresh token
 - refresh token is returned
 - failed request issued again with updated bearer token in header
 
 ### Unsuccessful Token Refresh
  - open console debug window
  - click `get todos` button three times
  - third request will return 401
  - interceptor queue request and make request to refresh token
  - refresh token request fails
  - observable error thrown and log out
  
 ### Log out
  - open console debug window
  - click `get 401` button three times
  - request will return 401
  - interceptor queue request and make request to refresh token
  - refresh token is returned
  - failed request issued again with updated bearer token in header and returns 401
  - throw observable error and log out

    
  ### NOTE
  If click `get todos` while token is being refreshed a response will be received from the mock server as it is not configured for authentication.
  In reality if a request is made while the token is being refresh it will fail with a 401.
  The request will then be queued and it will be issued again when the token is refreshed.
