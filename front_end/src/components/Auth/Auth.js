class Auth {
    
      /**
       * Authenticate a user. Save a token string in Local Storage
       *
       * @param {string} token
       */
      static authenticateUser(token) {
        localStorage.setItem('token', token)
      }
    
      static setUserId(id){
        localStorage.setItem('userId',id)
      }
    
      static setNickname(nickname){
        localStorage.setItem('nickname',nickname)
      }
      
      static setDropboxToken(dropboxToken){
        localStorage.setItem('dropboxToken',dropboxToken)
      }
      /**
       * Check if a user is authenticated - check if a token is saved in Local Storage
       *
       * @returns {boolean}
       */
      static isUserAuthenticated() {
        return localStorage.getItem('token') !== null
      }
      /**
       * Check if a user is authenticated with dropbox - check if a dropbox token is saved in Local Storage
       *
       * @returns {boolean}
       */
      static isUserAuthenticatedWithDropbox() {
        return localStorage.getItem('dropboxToken') !== null
      }
    
      /**
       * Deauthenticate a user. Remove a token from Local Storage.
       *
       */
      static deauthenticateUser() {
        localStorage.removeItem('userId')
        localStorage.removeItem('token')
        localStorage.removeItem('nickname')
        localStorage.removeItem('dropboxToken')
      }
    
      /**
       * Get a token value.
       *
       * @returns {string}
       */
    
      static getToken() {
        return localStorage.getItem('token')
      }

      static getUserID(){
        return localStorage.getItem('userId')
      }
      
      static getNickname(){
        return localStorage.getItem('nickname')
      }
      
      static getDropboxToken(){
        return localStorage.getItem('dropboxToken')
      }
    }
    
    export default Auth