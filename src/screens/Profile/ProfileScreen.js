import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Bell, Lock, CircleHelp, ChevronRight, LogOut, Heart, Calendar, Moon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { usePregnancy } from '../../context/PregnancyContext';

const { width } = Dimensions.get('window');

const ProfileOption = ({ icon: Icon, label, value, type = 'link', onPress }) => (
    <TouchableOpacity style={styles.optionRow} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.optionIconContainer}>
            <Icon size={20} color="#FFF" />
        </View>
        <Text style={styles.optionLabel}>{label}</Text>
        {type === 'toggle' ? (
            <Switch
                trackColor={{ false: '#333', true: '#FF4D6D' }}
                thumbColor={'#FFF'}
                value={value}
                onValueChange={onPress}
            />
        ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {value && <Text style={styles.optionValue}>{value}</Text>}
                <ChevronRight size={16} color="#666" />
            </View>
        )}
    </TouchableOpacity>
);

export default function ProfileScreen() {
    const { name, dueDate, stats } = usePregnancy();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkMode, setDarkMode] = useState(true);

    const formattedDate = dueDate ? new Date(dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not set';

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <LinearGradient
                    colors={['#1c1c1e', '#000']}
                    style={styles.headerGradient}
                >
                    <View style={styles.avatarContainer}>
                        <LinearGradient
                            colors={['#FF4D6D', '#FF8FAB']}
                            style={styles.avatarGradient}
                        >
                            <User size={80} color="#FFF" />
                        </LinearGradient>
                        <TouchableOpacity style={styles.editBadge}>
                            <Settings size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.userName}>{name}</Text>
                    <Text style={styles.userStatus}>Week {stats ? stats.currentWeek : '12'} • Trimester {stats ? stats.trimester : '1'}</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats ? stats.daysRemaining : '--'}</Text>
                            <Text style={styles.statLabel}>Days Left</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{formattedDate}</Text>
                            <Text style={styles.statLabel}>Due Date</Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Personalization Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personalization</Text>
                    <View style={styles.sectionCard}>
                        <ProfileOption icon={User} label="Baby Name" value="Not set" />
                        <View style={styles.separator} />
                        <ProfileOption icon={Settings} label="Unit System" value="Metric" />
                        <View style={styles.separator} />
                        <ProfileOption icon={Calendar} label="Adjust Due Date" />
                    </View>
                </View>

                {/* Settings Sections */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>App Settings</Text>
                    <View style={styles.sectionCard}>
                        <ProfileOption
                            icon={Bell}
                            label="Notifications"
                            type="toggle"
                            value={notificationsEnabled}
                            onPress={() => setNotificationsEnabled(!notificationsEnabled)}
                        />
                        <View style={styles.separator} />
                        <ProfileOption
                            icon={Moon}
                            label="Dark Mode"
                            type="toggle"
                            value={darkMode}
                            onPress={() => setDarkMode(!darkMode)}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutButton}>
                    <LogOut size={20} color="#FF4D6D" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Version 1.1.0</Text>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    headerContainer: {
        height: Dimensions.get('window').height * 0.45, // 45% of screen height
        backgroundColor: '#1C1C1E',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: 'hidden',
    },
    headerGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
    },
    avatarContainer: {
        marginBottom: 20,
        position: 'relative',
        shadowColor: "#FF4D6D",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    avatarGradient: {
        width: 140,
        height: 140,
        borderRadius: 70,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#000',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 10,
        backgroundColor: '#333',
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#000',
    },
    userName: {
        color: '#FFF',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    userStatus: {
        color: '#888',
        fontSize: 16,
        marginBottom: 24,
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 20,
        alignItems: 'center',
        gap: 30,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    statLabel: {
        color: '#666',
        fontSize: 12,
        textTransform: 'uppercase',
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },

    // Content
    content: {
        paddingTop: 30,
        paddingBottom: 40,
    },

    // Settings Sections
    section: {
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        color: '#888',
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: 10,
        marginLeft: 4,
    },
    sectionCard: {
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#333',
        overflow: 'hidden',
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    optionIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    optionLabel: {
        flex: 1,
        color: '#FFF',
        fontSize: 16,
        fontWeight: '500',
    },
    optionValue: {
        color: '#666',
        fontSize: 14,
        marginRight: 8,
    },
    separator: {
        height: 1,
        backgroundColor: '#333',
        marginLeft: 60, // Align with text
    },

    // Logout
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginVertical: 10,
        padding: 16,
    },
    logoutText: {
        color: '#FF4D6D',
        fontSize: 16,
        fontWeight: '600',
    },
    versionText: {
        textAlign: 'center',
        color: '#444',
        fontSize: 12,
        marginBottom: 20,
    },
});
