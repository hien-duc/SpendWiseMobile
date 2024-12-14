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
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  illustrationContainer: {
    width: '80%',
    height: 300,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 100, // Adjust size as needed
    height: 100,
  },
  illustrationCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#00B152',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '100%',
    marginBottom: 24,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 16,
  },
});

export default WelcomeScreen;
