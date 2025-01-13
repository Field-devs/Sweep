import React, { useState, useRef } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useTheme } from '../contexts/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const isDark = theme === 'dark';

  const handleRegister = async () => {
    if (!email || !password || !name) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;
      
      alert('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    } catch (error) {
      alert('Error during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, field: 'name' | 'email' | 'password') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (field === 'name') {
        emailRef.current?.focus();
      } else if (field === 'email') {
        passwordRef.current?.focus();
      } else {
        handleRegister();
      }
    }
  };

  const styles = getStyles(isDark);

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TouchableOpacity 
          style={styles.themeToggle}
          onPress={toggleTheme}
        >
          {isDark ? (
            <FiSun size={24} color="#fff" />
          ) : (
            <FiMoon size={24} color="#000" />
          )}
        </TouchableOpacity>

        <View style={styles.form}>
          <Text style={styles.title}>Create Account</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor={isDark ? '#999' : '#666'}
            value={name}
            onChangeText={setName}
            onKeyPress={(e: any) => handleKeyPress(e, 'name')}
            returnKeyType="next"
            blurOnSubmit={false}
          />

          <TextInput
            ref={emailRef}
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={isDark ? '#999' : '#666'}
            value={email}
            onChangeText={setEmail}
            onKeyPress={(e: any) => handleKeyPress(e, 'email')}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            blurOnSubmit={false}
          />
          
          <TextInput
            ref={passwordRef}
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={isDark ? '#999' : '#666'}
            value={password}
            onChangeText={setPassword}
            onKeyPress={(e: any) => handleKeyPress(e, 'password')}
            secureTextEntry
            returnKeyType="go"
            onSubmitEditing={handleRegister}
          />
          
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating Account...' : 'Register'}
            </Text>
          </TouchableOpacity>

          <View style={styles.links}>
            <TouchableOpacity onPress={() => navigate('/login')}>
              <Text style={styles.link}>Already have an account? Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  // ... (styles remain the same)
});