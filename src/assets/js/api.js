(function() {
  'use strict';

  // Mock API service for social authentication
  const API_BASE_URL = 'https://api.pawfectcare.com'; // Replace with your actual API
  
  // Mock social login responses
  const mockSocialUsers = {
    google: {
      id: 'google_123456789',
      email: 'user@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+84901234567',
      avatar: 'https://via.placeholder.com/100',
      provider: 'google'
    },
    facebook: {
      id: 'facebook_987654321',
      email: 'user@facebook.com',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+84987654321',
      avatar: 'https://via.placeholder.com/100',
      provider: 'facebook'
    },
    apple: {
      id: 'apple_456789123',
      email: 'user@icloud.com',
      firstName: 'Mike',
      lastName: 'Johnson',
      phone: '+84945678912',
      avatar: 'https://via.placeholder.com/100',
      provider: 'apple'
    }
  };

  // Google OAuth 2.0 implementation
  window.initGoogleAuth = () => {
    return new Promise((resolve, reject) => {
      // Check if Google API is loaded
      if (typeof gapi === 'undefined') {
        console.log('Google API not loaded, using mock');
        reject(new Error('Google API not loaded'));
        return;
      }

      try {
        gapi.load('auth2', () => {
          gapi.auth2.init({
            client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com' // Replace with your client ID
          }).then(() => {
            const authInstance = gapi.auth2.getAuthInstance();
            authInstance.signIn().then(googleUser => {
              const profile = googleUser.getBasicProfile();
              const authResponse = googleUser.getAuthResponse();
              
              const userData = {
                id: profile.getId(),
                email: profile.getEmail(),
                firstName: profile.getGivenName(),
                lastName: profile.getFamilyName(),
                avatar: profile.getImageUrl(),
                accessToken: authResponse.access_token,
                provider: 'google'
              };
              
              resolve(userData);
            }).catch(error => {
              console.log('Google sign in failed:', error);
              reject(error);
            });
          }).catch(error => {
            console.log('Google auth2 init failed:', error);
            reject(error);
          });
        });
      } catch (error) {
        console.log('Google API error:', error);
        reject(error);
      }
    });
  };

  // Facebook Login implementation
  window.initFacebookAuth = () => {
    return new Promise((resolve, reject) => {
      // Check if Facebook SDK is loaded
      if (typeof FB === 'undefined') {
        console.log('Facebook SDK not loaded, using mock');
        reject(new Error('Facebook SDK not loaded'));
        return;
      }

      // Check if we're on HTTPS (required for Facebook)
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        console.log('Facebook login requires HTTPS, using mock');
        reject(new Error('Facebook login requires HTTPS'));
        return;
      }

      // Check if FB is initialized
      if (!window.fbReady) {
        console.log('Facebook SDK not ready, using mock');
        reject(new Error('Facebook SDK not ready'));
        return;
      }

      try {
        FB.login((response) => {
          if (response.authResponse) {
            FB.api('/me', { fields: 'id,name,email,picture' }, (userInfo) => {
              const userData = {
                id: userInfo.id,
                email: userInfo.email,
                firstName: userInfo.name.split(' ')[0],
                lastName: userInfo.name.split(' ').slice(1).join(' '),
                avatar: userInfo.picture.data.url,
                accessToken: response.authResponse.accessToken,
                provider: 'facebook'
              };
              resolve(userData);
            });
          } else {
            console.log('Facebook login failed:', response);
            reject(new Error('Facebook login failed'));
          }
        }, { scope: 'email,public_profile' });
      } catch (error) {
        console.log('Facebook API error:', error);
        reject(error);
      }
    });
  };

  // Apple Sign In implementation
  window.initAppleAuth = () => {
    return new Promise((resolve, reject) => {
      // Check if Apple Sign In is available
      if (typeof AppleID === 'undefined') {
        reject(new Error('Apple Sign In not available'));
        return;
      }

      AppleID.auth.signIn().then((response) => {
        // Decode the identity token to get user info
        const userData = {
          id: response.user,
          email: response.email,
          firstName: response.fullName?.givenName || 'Apple',
          lastName: response.fullName?.familyName || 'User',
          avatar: null, // Apple doesn't provide avatar
          accessToken: response.authorization.id_token,
          provider: 'apple'
        };
        resolve(userData);
      }).catch(error => {
        reject(error);
      });
    });
  };

  // Mock implementation for development/testing
  window.mockSocialLogin = (provider) => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const userData = mockSocialUsers[provider];
        if (userData) {
          resolve(userData);
        } else {
          reject(new Error(`Unknown provider: ${provider}`));
        }
      }, 1000);
    });
  };

  // API call to backend for social login
  window.socialLoginAPI = async (provider, userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/social-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          userData
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Social login API error:', error);
      throw error;
    }
  };

  // Fallback to mock for development
  window.handleSocialLogin = async (provider) => {
    try {
      let userData;
      
      // Try real social login first
      switch (provider) {
        case 'google':
          userData = await window.initGoogleAuth();
          break;
        case 'facebook':
          userData = await window.initFacebookAuth();
          break;
        case 'apple':
          userData = await window.initAppleAuth();
          break;
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }

      // Send to backend
      const result = await window.socialLoginAPI(provider, userData);
      return result;
      
    } catch (error) {
      console.log(`Real ${provider} login failed, using mock:`, error.message);
      
      // Fallback to mock for development
      const mockUserData = await window.mockSocialLogin(provider);
      
      // Simulate backend response
      return {
        success: true,
        user: mockUserData,
        message: `${provider} login successful (mock)`
      };
    }
  };

})();
