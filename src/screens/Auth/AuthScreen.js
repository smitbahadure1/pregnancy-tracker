import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Heart, ArrowRight, Eye, EyeOff } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { auth } from '../../lib/firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from 'firebase/auth';

export default function AuthScreen() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSignUp = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email.trim(), password);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Success', 'Account created! Welcome.');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setIsSignUp(false);
        } catch (err) {
            Alert.alert('Error', err.message);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email');
            return;
        }

        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            // Navigation will happen automatically via context
        } catch (err) {
            Alert.alert('Error', err.message);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email');
            return;
        }

        setIsLoading(true);
        try {
            await sendPasswordResetEmail(auth, email.trim());

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Success', 'Password reset email sent! Check your inbox.');
            setIsForgotPassword(false);
            setEmail('');
        } catch (err) {
            Alert.alert('Error', err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LinearGradient colors={['#1a0a2e', '#16213e', '#0f3460']} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.header}>
                            <Heart size={50} color="#ff6b9d" />
                            <Text style={styles.title}>Pregnancy Tracker</Text>
                            <Text style={styles.subtitle}>
                                {isForgotPassword
                                    ? 'Reset your password'
                                    : isSignUp
                                        ? 'Create your account'
                                        : 'Welcome back, Mom'}
                            </Text>
                        </View>

                        {isForgotPassword ? (
                            <View style={styles.form}>
                                <View style={styles.inputGroup}>
                                    <Mail size={20} color="#ff6b9d" style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Email"
                                        placeholderTextColor="#999"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        editable={!isLoading}
                                        autoCapitalize="none"
                                    />
                                </View>

                                <TouchableOpacity
                                    style={[styles.button, isLoading && styles.buttonDisabled]}
                                    onPress={handleForgotPassword}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <>
                                            <Text style={styles.buttonText}>Send Reset Email</Text>
                                            <ArrowRight size={18} color="#fff" style={styles.buttonIcon} />
                                        </>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setIsForgotPassword(false)}>
                                    <Text style={styles.toggleLink}>Back to Sign In</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.form}>
                                <View style={styles.inputGroup}>
                                    <Mail size={20} color="#ff6b9d" style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Email"
                                        placeholderTextColor="#999"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        editable={!isLoading}
                                        autoCapitalize="none"
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Lock size={20} color="#ff6b9d" style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Password"
                                        placeholderTextColor="#999"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                        editable={!isLoading}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        {showPassword ? (
                                            <EyeOff size={20} color="#ff6b9d" />
                                        ) : (
                                            <Eye size={20} color="#ff6b9d" />
                                        )}
                                    </TouchableOpacity>
                                </View>

                                {isSignUp && (
                                    <View style={styles.inputGroup}>
                                        <Lock size={20} color="#ff6b9d" style={styles.icon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Confirm Password"
                                            placeholderTextColor="#999"
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                            secureTextEntry={!showConfirmPassword}
                                            editable={!isLoading}
                                        />
                                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? (
                                                <EyeOff size={20} color="#ff6b9d" />
                                            ) : (
                                                <Eye size={20} color="#ff6b9d" />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                )}

                                <TouchableOpacity
                                    style={[styles.button, isLoading && styles.buttonDisabled]}
                                    onPress={isSignUp ? handleSignUp : handleSignIn}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <>
                                            <Text style={styles.buttonText}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
                                            <ArrowRight size={18} color="#fff" style={styles.buttonIcon} />
                                        </>
                                    )}
                                </TouchableOpacity>

                                {!isSignUp && (
                                    <TouchableOpacity onPress={() => setIsForgotPassword(true)}>
                                        <Text style={styles.forgotPasswordLink}>Forgot password?</Text>
                                    </TouchableOpacity>
                                )}

                                <View style={styles.toggleContainer}>
                                    <Text style={styles.toggleText}>
                                        {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                                    </Text>
                                    <TouchableOpacity onPress={() => {
                                        setIsSignUp(!isSignUp);
                                        setPassword('');
                                        setConfirmPassword('');
                                    }}>
                                        <Text style={styles.toggleLink}>{isSignUp ? 'Sign In' : 'Sign Up'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 15,
    },
    subtitle: {
        fontSize: 16,
        color: '#ccc',
        marginTop: 8,
    },
    form: {
        gap: 16,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: 'rgba(255, 107, 157, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
    },
    icon: {
        marginRight: 4,
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#ff6b9d',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        gap: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    buttonIcon: {
        marginLeft: 4,
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    toggleText: {
        fontSize: 14,
        color: '#999',
    },
    toggleLink: {
        fontSize: 14,
        color: '#ff6b9d',
        fontWeight: '600',
    },
    forgotPasswordLink: {
        fontSize: 14,
        color: '#ff6b9d',
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 8,
    },
});
