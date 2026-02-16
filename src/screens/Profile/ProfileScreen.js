import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, Dimensions, Modal, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Bell, Lock, CircleHelp, ChevronRight, LogOut, Heart, Calendar, Moon, X, Check, Shield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
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
    const navigation = useNavigation();
    const { name, setName, dueDate, setDueDate, stats, logout, user } = usePregnancy();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    // Edit Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [editType, setEditType] = useState(null); // 'name' | 'date'
    const [inputValue, setInputValue] = useState('');

    const formattedDate = dueDate ? new Date(dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not set';

    const handleOpenEdit = (type) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setEditType(type);
        setInputValue(type === 'name' ? name : dueDate ? new Date(dueDate).toISOString().split('T')[0] : '');
        setModalVisible(true);
    };

    const route = useRoute();

    useFocusEffect(
        React.useCallback(() => {
            if (route.params?.openEdit) {
                // Small timeout to allow screen transition
                setTimeout(() => {
                    handleOpenEdit(route.params.openEdit);
                    // Clear the param so it doesn't reopen on next focus
                    navigation.setParams({ openEdit: null });
                }, 100);
            }
        }, [route.params?.openEdit])
    );

    const handleSave = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (editType === 'name') {
            setName(inputValue);
        } else if (editType === 'date') {
            const newDate = new Date(inputValue);
            if (isNaN(newDate.getTime())) {
                Alert.alert("Invalid Date", "Please enter a valid date in YYYY-MM-DD format.");
                return;
            }
            setDueDate(newDate);
        }
        setModalVisible(false);
    };

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", onPress: () => { } },
                {
                    text: "Log Out",
                    onPress: () => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        logout();
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const handleUnitToggle = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert("Unit System", "Currently, only Metric (kg/ml) is supported.");
    };

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
                        <TouchableOpacity style={styles.editBadge} onPress={() => handleOpenEdit('name')}>
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
                        <ProfileOption
                            icon={User}
                            label="Baby Name"
                            value={name}
                            onPress={() => handleOpenEdit('name')}
                        />
                        <View style={styles.separator} />
                        <ProfileOption
                            icon={Settings}
                            label="Unit System"
                            value="Metric"
                            onPress={handleUnitToggle}
                        />
                        <View style={styles.separator} />
                        <ProfileOption
                            icon={Calendar}
                            label="Adjust Due Date"
                            onPress={() => handleOpenEdit('date')}
                        />
                    </View>
                </View>

                {/* Admin Section */}
                {user?.email === 'priyankachavan2675@gmail.com' && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Admin</Text>
                        <View style={styles.sectionCard}>
                            <TouchableOpacity
                                style={styles.adminButton}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    navigation.navigate('Admin');
                                }}
                            >
                                <View style={styles.adminIconContainer}>
                                    <Shield size={20} color="#FFF" />
                                </View>
                                <Text style={styles.adminLabel}>View All Accounts</Text>
                                <ChevronRight size={16} color="#666" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <LogOut size={20} color="#FF4D6D" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Version 1.1.0</Text>

            </ScrollView>

            {/* EDIT MODAL */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalContainer}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {editType === 'name' ? 'Edit Baby Name' : 'Edit Due Date'}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <X size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalLabel}>
                            {editType === 'name' ? 'Name' : 'Due Date (YYYY-MM-DD)'}
                        </Text>

                        <TextInput
                            style={styles.input}
                            value={inputValue}
                            onChangeText={setInputValue}
                            placeholder={editType === 'name' ? "Enter name" : "YYYY-MM-DD"}
                            placeholderTextColor="#666"
                            autoFocus
                        />

                        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                            <Text style={styles.saveBtnText}>Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
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

    // Modal
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalContent: {
        backgroundColor: '#1c1c1e',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalLabel: {
        color: '#888',
        fontSize: 14,
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#333',
        borderRadius: 12,
        padding: 16,
        color: '#FFF',
        fontSize: 16,
        marginBottom: 20,
    },
    saveBtn: {
        backgroundColor: '#FF4D6D',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
    },
    saveBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    adminButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
    },
    adminIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    adminLabel: {
        flex: 1,
        color: '#FFF',
        fontSize: 16,
        fontWeight: '500',
    },
});
