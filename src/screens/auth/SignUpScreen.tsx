import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { signUpWithEmail } from '../../../supabase';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
  SlideInDown,
} from 'react-native-reanimated';

const SignUpScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const { data, error } = await signUpWithEmail(email, password, name);
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert(
        'Success',
        'Registration successful! Please check your email to verify your account.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="chevron-left" size={30} color="#334155" />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={styles.content}
        entering={FadeIn.duration(1000)}
      >
        <Animated.Text
          style={styles.title}
          entering={FadeInDown.duration(1000).delay(300)}
        >
          Let's{'\n'}Get Started
        </Animated.Text>

        <Animated.Text
          style={styles.subtitle}
          entering={FadeInDown.duration(1000).delay(400)}
        >
          Create an account to continue
        </Animated.Text>

        <Animated.View
          style={styles.form}
          entering={SlideInDown.duration(1000).delay(500)}
        >
          <View style={styles.inputContainer}>
            <Icon name="account-outline" size={22} color="#64748B" />
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#94A3B8"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="email-outline" size={22} color="#64748B" />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#94A3B8"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock-outline" size={22} color="#64748B" />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#94A3B8"
              editable={!loading}
            />
          </View>

          <Animated.View entering={FadeInUp.duration(800).delay(700)}>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign up</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={styles.loginContainer}
            entering={FadeInUp.duration(800).delay(800)}
          >
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              disabled={loading}
            >
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 17,
    color: '#64748B',
    marginBottom: 40,
    letterSpacing: 0.1,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#334155',
    letterSpacing: 0.2,
  },
  button: {
    backgroundColor: '#4CAF50',
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 16,
    color: '#64748B',
    letterSpacing: 0.2,
  },
  loginLink: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

export default SignUpScreen;