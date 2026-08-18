import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Layout, Text, Input, Button, Icon } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// Using the Electric Cyan highlight defined in Phase 3
const PRIMARY_ACCENT = '#00F0FF';

export function LoginScreen() {
  const navigation = useNavigation<any>();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totp, setTotp] = useState('');
  const [mfaToken, setMfaToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('http://10.0.2.2:8000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }
      
      setMfaToken(data.mfa_token);
      setStep(2);
    } catch (error: any) {
      Alert.alert('Authentication Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMFA = async () => {
    if (!totp) {
      Alert.alert('Error', 'MFA code is required.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('http://10.0.2.2:8000/api/v1/auth/verify-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, totp, mfa_token: mfaToken })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'MFA failed');
      }
      
      // Store the JWT Access Token in AsyncStorage for the Axios Interceptors to use
      await AsyncStorage.setItem('access_token', data.access_token);
      
      // Navigate to the main app dashboard (Hifz Instructor portal)
      navigation.replace('HifzInstructor');
    } catch (error: any) {
      Alert.alert('MFA Verification Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={styles.container}>
      <View style={styles.content}>
        <Text category="h1" style={styles.title}>
          Suffat-ul Huffaz
        </Text>
        <Text category="s1" style={styles.subtitle}>
          Mobile Instructor Portal
        </Text>

        {step === 1 ? (
          <View style={styles.formContainer}>
            <Input
              label="Email Address"
              placeholder="instructor@suffat.org"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              status="primary"
            />
            <Input
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
              status="primary"
            />
            <Button
              onPress={handleLogin}
              disabled={loading}
              style={styles.button}
            >
              {loading ? 'Authenticating...' : 'Secure Login'}
            </Button>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Text category="p2" style={styles.mfaInstruction}>
              Enter the 6-digit TOTP code from your authenticator app to verify your identity.
            </Text>
            <Input
              label="MFA Authenticator Code"
              placeholder="123456"
              value={totp}
              onChangeText={setTotp}
              style={styles.input}
              keyboardType="number-pad"
              maxLength={6}
              status="primary"
            />
            <Button
              onPress={handleVerifyMFA}
              disabled={loading}
              style={styles.button}
            >
              {loading ? 'Verifying...' : 'Verify MFA & Enter'}
            </Button>
            <Button
              appearance="ghost"
              onPress={() => setStep(1)}
              style={styles.backButton}
            >
              Back to Login
            </Button>
          </View>
        )}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Theming defined to Deep Midnight by the UI Kitten custom-theme.json, 
    // but enforcing fallback behavior here.
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
    color: '#FFFFFF',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 40,
    color: PRIMARY_ACCENT, // Electric Cyan Accent
  },
  formContainer: {
    backgroundColor: '#111827', // Slightly lighter midnight for card
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 12,
  },
  backButton: {
    marginTop: 8,
  },
  mfaInstruction: {
    marginBottom: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  }
});
