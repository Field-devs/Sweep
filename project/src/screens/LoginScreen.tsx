import React, { useState, useRef } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, Dimensions, useWindowDimensions } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const WISELOG_LOGO = 'https://static.wixstatic.com/media/0cc329_0d3cd276e35f472296929bc8f561526c~mv2.png';
const BACKGROUND_IMAGE = 'https://static.wixstatic.com/media/0cc329_259a6118ee914ed7a5dee69a9e3ef525~mv2.jpeg';

export default function LoginScreen() {
  const window = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  
  const passwordRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await signIn(email, password);
      navigate('/routes');
    } catch (error: any) {
      console.error('Login error:', error);
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, field: 'email' | 'password') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (field === 'email') {
        passwordRef.current?.focus();
      } else {
        handleLogin();
      }
    }
  };

  const getStyles = (window: { width: number, height: number }) => StyleSheet.create({
    backgroundImage: {
      flex: 1,
      width: '100%',
      height: '100vh',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: window.width < 768 ? 16 : 20,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    containerDark: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    formContainer: {
      width: '100%',
      maxWidth: window.width < 768 ? '100%' : 400,
      position: 'relative',
    },
    themeToggle: {
      position: 'absolute',
      top: window.width < 768 ? -40 : -50,
      right: 0,
      padding: 8,
      borderRadius: 50,
      backgroundColor: 'transparent',
      zIndex: 1,
    },
    form: {
      padding: window.width < 768 ? 16 : 20,
      borderRadius: 16,
      overflow: 'hidden',
    },
    glassEffect: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
    },
    formDark: {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: window.width < 768 ? 16 : 20,
    },
    logoWrapper: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      justifyContent: 'center',
    },
    logo: {
      width: window.width < 768 ? 150 : 200,
      height: window.width < 768 ? 40 : 50,
    },
    errorText: {
      color: '#ff4444',
      marginBottom: 10,
      textAlign: 'center',
      fontSize: window.width < 768 ? 14 : 16,
    },
    input: {
      height: window.width < 768 ? 44 : 48,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: 8,
      marginBottom: 12,
      paddingHorizontal: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      color: '#333',
      fontSize: window.width < 768 ? 14 : 16,
      width: '100%',
    },
    inputDark: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      color: '#fff',
    },
    button: {
      backgroundColor: '#0066cc',
      padding: window.width < 768 ? 10 : 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 8,
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    buttonText: {
      color: 'white',
      fontSize: window.width < 768 ? 14 : 16,
      fontWeight: 'bold',
    },
    links: {
      marginTop: window.width < 768 ? 16 : 20,
      flexDirection: window.width < 768 ? 'column' : 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: window.width < 768 ? 8 : 0,
    },
    link: {
      color: '#fff',
      fontSize: window.width < 768 ? 12 : 14,
      textShadow: '0 1px 3px rgba(0,0,0,0.3)',
      textAlign: 'center',
    },
    linkDark: {
      color: '#fff',
    },
    linkSeparator: {
      marginHorizontal: 8,
      color: '#fff',
      display: window.width < 768 ? 'none' : 'flex',
    },
  });

  const styles = getStyles(window);

  return (
    <ImageBackground 
      source={{ uri: BACKGROUND_IMAGE }} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={[styles.container, isDark && styles.containerDark]}>
        <View style={styles.formContainer}>
          <TouchableOpacity 
            style={styles.themeToggle}
            onPress={toggleTheme}
          >
            {isDark ? (
              <FiSun size={16} color="#fff" />
            ) : (
              <FiMoon size={16} color="#000" />
            )}
          </TouchableOpacity>

          <View style={[styles.form, isDark && styles.formDark, styles.glassEffect]}>
            <View style={styles.logoContainer}>
              <View style={styles.logoWrapper}>
                <Image
                  source={{ uri: WISELOG_LOGO }}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
            </View>
            
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}

            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="Email"
              placeholderTextColor={isDark ? '#999' : '#666'}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError('');
              }}
              onKeyPress={(e: any) => handleKeyPress(e, 'email')}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              blurOnSubmit={false}
            />
            
            <TextInput
              ref={passwordRef}
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="Password"
              placeholderTextColor={isDark ? '#999' : '#666'}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError('');
              }}
              onKeyPress={(e: any) => handleKeyPress(e, 'password')}
              secureTextEntry
              returnKeyType="go"
              onSubmitEditing={handleLogin}
            />
            
            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <View style={styles.links}>
              <TouchableOpacity onPress={() => navigate('/register')}>
                <Text style={[styles.link, isDark && styles.linkDark]}>
                  Create Account
                </Text>
              </TouchableOpacity>
              <Text style={styles.linkSeparator}>•</Text>
              <TouchableOpacity>
                <Text style={[styles.link, isDark && styles.linkDark]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}