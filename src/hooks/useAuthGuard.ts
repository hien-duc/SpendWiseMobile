import React, { useEffect, ComponentType, ReactElement } from 'react';
import { useAuth } from '../context/AuthContext';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const useAuthGuard = (
  callback: () => void,
  options: {
    showLoginPrompt?: boolean,
    redirectToLogin?: boolean
  } = {
      showLoginPrompt: true,
      redirectToLogin: true
    }
) => {
  const { isAuthenticated, loading } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const checkAndExecute = async () => {
      console.log('AuthGuard: Checking authentication state...');
      console.log('AuthGuard: Loading state:', loading);
      console.log('AuthGuard: Authenticated state:', isAuthenticated);

      if (!loading && !isAuthenticated) {
        console.log('AuthGuard: User not authenticated');
        if (options.showLoginPrompt) {
          Alert.alert(
            'Authentication Required',
            'Please log in to access this feature.',
            [
              {
                text: 'Login',
                onPress: () => {
                  if (options.redirectToLogin && navigation) {
                    navigation.navigate('Auth');
                  }
                }
              },
              {
                text: 'Cancel',
                style: 'cancel'
              }
            ]
          );
        }
      } else if (isAuthenticated) {
        console.log('AuthGuard: User authenticated, executing callback');
        callback();
      }
    };

    checkAndExecute();
  }, [isAuthenticated, loading]);

  return { isAuthenticated, loading };
};

export const withAuthGuard = <P extends object>(
  WrappedComponent: ComponentType<P>,
  options?: {
    showLoginPrompt?: boolean,
    redirectToLogin?: boolean
  }
) => {
  return function EnhancedComponent(props: P): ReactElement | null {
    const { isAuthenticated, loading } = useAuthGuard(() => { }, options);
    const navigation = useNavigation();

    if (loading) {
      // Optional: Return a loading spinner
      return null;
    }

    if (!isAuthenticated) {
      // Optional: Show login prompt or redirect
      if (options?.showLoginPrompt) {
        Alert.alert(
          'Authentication Required',
          'Please log in to access this feature.',
          [
            {
              text: 'Login',
              onPress: () => {
                if (options?.redirectToLogin && navigation) {
                  navigation.navigate('Auth');
                }
              }
            },
            {
              text: 'Cancel',
              style: 'cancel'
            }
          ]
        );
      }
      return null;
    }

    return React.createElement(WrappedComponent, props);
  };
};
