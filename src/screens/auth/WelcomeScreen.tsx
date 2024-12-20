import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Image,
} from 'react-native';
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';


const WelcomeScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.illustrationContainer}>
          <View style={styles.illustrationCircle}>
            {/* <MaterialCommunityIcons name="wallet" size={60} color="#00B152" /> */}
            <View style={styles.illustrationCircle}>
            <LottieView
              source={require('../../../assets/lottie.json')}
              autoPlay
              loop
              style={styles.lottie}
            />
          </View>
          </View>
        </View>

        <Text style={styles.title}>SpendWise!</Text>
        <Text style={styles.subtitle}>
          Track your expenses wisely and{'\n'}
          manage your finances better.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.buttonText}>Getting Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  illustrationCircle: {
    width: 300,
    height: 300,
    borderRadius: '50%',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 220,
    height: 220,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2E3A59',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8F9BB3',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loginText: {
    marginTop: 24,
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
  },
});

export default WelcomeScreen;
