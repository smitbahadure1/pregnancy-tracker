import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, Clock, Mail, LogIn, LogOut, Shield } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';

const { width } = Dimensions.get('window');

export default function AdminScreen() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllUsers();
        // Refresh every 10 seconds
        const interval = setInterval(fetchAllUsers, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchAllUsers = async () => {
        try {
            // Get all profiles with their activity
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.log('Error fetching users:', error);
                return;
            }

            if (data) {
                setUsers(data);
            }
        } catch (err) {
            console.log('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getProgressBar = (progress) => {
        const percentage = Math.round(progress * 100);
        return {
            percentage,
            color: percentage < 30 ? '#FF6B9D' : percentage < 70 ? '#FFA500' : '#4CAF50'
        };
    };

    if (loading) {
        return (
            <LinearGradient colors={['#1a0a2e', '#16213e', '#0f3460']} style={styles.container}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FF4D6D" />
                        <Text style={styles.loadingText}>Loading Accounts...</Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={['#1a0a2e', '#16213e', '#0f3460']} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Shield size={40} color="#FF4D6D" />
                        <Text style={styles.title}>Admin Dashboard</Text>
                        <Text style={styles.subtitle}>User Accounts & Activity</Text>
                    </View>

                    {/* Summary Stats */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statBox}>
                            <Users size={24} color="#FF4D6D" />
                            <Text style={styles.statValue}>{users.length}</Text>
                            <Text style={styles.statLabel}>Total Users</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Clock size={24} color="#4CC9F0" />
                            <Text style={styles.statValue}>{users.filter(u => u.onboarding_complete).length}</Text>
                            <Text style={styles.statLabel}>Completed Setup</Text>
                        </View>
                    </View>

                    {/* Users List */}
                    <Text style={styles.sectionTitle}>Active Accounts</Text>
                    
                    {users.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>No accounts yet</Text>
                        </View>
                    ) : (
                        users.map((user, index) => {
                            const progress = user.onboarding_complete ? 1 : 0.5;
                            const { percentage, color } = getProgressBar(progress);

                            return (
                                <View key={index} style={styles.userCard}>
                                    <View style={styles.userHeader}>
                                        <View style={styles.userInfo}>
                                            <Text style={styles.userName}>{user.name || 'Mom-to-be'}</Text>
                                            <View style={styles.emailRow}>
                                                <Mail size={14} color="#999" style={styles.emailIcon} />
                                                <Text style={styles.userEmail}>{user.email || 'No email'}</Text>
                                            </View>
                                        </View>
                                        <View style={[styles.statusBadge, { backgroundColor: user.onboarding_complete ? '#4CAF50' : '#FFA500' }]}>
                                            <Text style={styles.statusText}>{user.onboarding_complete ? 'Active' : 'Setup'}</Text>
                                        </View>
                                    </View>

                                    {/* Progress Bar */}
                                    <View style={styles.progressSection}>
                                        <View style={styles.progressBar}>
                                            <View 
                                                style={[
                                                    styles.progressFill, 
                                                    { width: `${percentage}%`, backgroundColor: color }
                                                ]} 
                                            />
                                        </View>
                                        <Text style={styles.progressText}>{percentage}% Setup Complete</Text>
                                    </View>

                                    {/* Account Details */}
                                    <View style={styles.detailsRow}>
                                        <View style={styles.detailItem}>
                                            <LogIn size={16} color="#FF4D6D" />
                                            <View style={styles.detailText}>
                                                <Text style={styles.detailLabel}>Account Created</Text>
                                                <Text style={styles.detailValue}>{formatDate(user.created_at)}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.detailItem}>
                                            <Text style={styles.dueDateLabel}>Due Date</Text>
                                            <Text style={styles.dueDateValue}>{user.due_date || 'Not set'}</Text>
                                        </View>
                                    </View>

                                    {/* Pregnancy Stats */}
                                    {user.onboarding_complete && (
                                        <View style={styles.statsRow}>
                                            <View style={styles.stat}>
                                                <Text style={styles.statSmallLabel}>Water Goal</Text>
                                                <Text style={styles.statSmallValue}>{user.water_target}ml</Text>
                                            </View>
                                            <View style={styles.stat}>
                                                <Text style={styles.statSmallLabel}>Sleep Goal</Text>
                                                <Text style={styles.statSmallValue}>{user.sleep_goal}h</Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            );
                        })
                    )}

                    <Text style={styles.footerText}>Real-time account monitoring • All data encrypted & secure</Text>
                </ScrollView>
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
    content: {
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        marginTop: 12,
        fontSize: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 12,
    },
    subtitle: {
        fontSize: 14,
        color: '#999',
        marginTop: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 30,
    },
    statBox: {
        flex: 1,
        backgroundColor: 'rgba(255, 77, 109, 0.1)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 77, 109, 0.2)',
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 12,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        color: '#999',
        fontSize: 16,
    },
    userCard: {
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    userHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    emailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    emailIcon: {
        marginRight: 6,
    },
    userEmail: {
        fontSize: 13,
        color: '#999',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    progressSection: {
        marginBottom: 12,
    },
    progressBar: {
        height: 6,
        backgroundColor: '#333',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 6,
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 12,
        color: '#999',
    },
    detailsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    detailItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255, 77, 109, 0.05)',
        padding: 10,
        borderRadius: 8,
    },
    detailText: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 11,
        color: '#999',
    },
    detailValue: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '500',
        marginTop: 2,
    },
    dueDateLabel: {
        fontSize: 11,
        color: '#999',
    },
    dueDateValue: {
        fontSize: 12,
        color: '#FF4D6D',
        fontWeight: '600',
        marginTop: 2,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    stat: {
        flex: 1,
        backgroundColor: '#0F3460',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    statSmallLabel: {
        fontSize: 11,
        color: '#999',
    },
    statSmallValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FF4D6D',
        marginTop: 4,
    },
    footerText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginTop: 30,
    },
});
