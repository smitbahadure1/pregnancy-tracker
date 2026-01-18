import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Check, Moon, Star, Minus, Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { usePregnancy } from '../../context/PregnancyContext';

const { width } = Dimensions.get('window');

const QUALITY_OPTIONS = [
    { label: 'Poor', color: '#ff4d4d' }, // Red-ish
    { label: 'Fair', color: '#ffd93d' }, // Yellow
    { label: 'Good', color: '#68d391' }, // Green
    { label: 'Excellent', color: '#4cc9f0' } // Blue
];

export default function SleepEntryScreen({ navigation }) {
    const { sleep, setSleep } = usePregnancy();
    const [tempSleep, setTempSleep] = useState(sleep);

    const adjustTime = (type, amount) => {
        setTempSleep(prev => {
            let newMinutes = prev.minutes;
            let newHours = prev.hours;

            if (type === 'minutes') {
                newMinutes += amount;
                if (newMinutes >= 60) {
                    newMinutes -= 60;
                    newHours += 1;
                } else if (newMinutes < 0) {
                    newMinutes += 60;
                    newHours -= 1;
                }
            } else {
                newHours += amount;
            }

            // Clamping
            if (newHours < 0) newHours = 0;
            if (newHours > 24) newHours = 24;

            return { ...prev, hours: newHours, minutes: newMinutes };
        });
        Haptics.selectionAsync();
    };

    const setQuality = (quality) => {
        setTempSleep(prev => ({ ...prev, quality }));
        Haptics.selectionAsync();
    };

    const handleSave = () => {
        setSleep(tempSleep);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.overlay}>
                <SafeAreaView style={styles.safeArea}>

                    <View style={styles.contentContainer}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Sleep Log</Text>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                                <X size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        {/* Visual Icon */}
                        <View style={styles.iconContainer}>
                            <Moon size={40} color="#A9DEF9" fill="#A9DEF9" />
                        </View>

                        {/* Main Time Display */}
                        <View style={styles.timeDisplay}>
                            {/* Hours */}
                            <View style={styles.timeSection}>
                                <TouchableOpacity onPress={() => adjustTime('hours', 1)} style={styles.adjustBtn}>
                                    <Plus size={24} color="#FFF" />
                                </TouchableOpacity>
                                <Text style={styles.timeValue}>{tempSleep.hours}<Text style={styles.timeLabel}>h</Text></Text>
                                <TouchableOpacity onPress={() => adjustTime('hours', -1)} style={styles.adjustBtn}>
                                    <Minus size={24} color="#FFF" />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.timeSeparator}>:</Text>

                            {/* Minutes */}
                            <View style={styles.timeSection}>
                                <TouchableOpacity onPress={() => adjustTime('minutes', 15)} style={styles.adjustBtn}>
                                    <Plus size={24} color="#FFF" />
                                </TouchableOpacity>
                                <Text style={styles.timeValue}>{tempSleep.minutes}<Text style={styles.timeLabel}>m</Text></Text>
                                <TouchableOpacity onPress={() => adjustTime('minutes', -15)} style={styles.adjustBtn}>
                                    <Minus size={24} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Quality Selector */}
                        <Text style={styles.sectionLabel}>SLEEP QUALITY</Text>
                        <View style={styles.qualityRow}>
                            {QUALITY_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option.label}
                                    onPress={() => setQuality(option.label)}
                                    style={[
                                        styles.qualityBtn,
                                        tempSleep.quality === option.label && { backgroundColor: option.color }
                                    ]}
                                >
                                    <Text style={[
                                        styles.qualityText,
                                        tempSleep.quality === option.label ? { color: '#000' } : { color: '#888' }
                                    ]}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Save Button */}
                        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                            <LinearGradient
                                colors={['#A9DEF9', '#bde0fe']} // Sleepy blues
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.saveGradient}
                            >
                                <Text style={styles.saveText}>Save Sleep Log</Text>
                                <Check size={20} color="#000" style={{ marginLeft: 8 }} />
                            </LinearGradient>
                        </TouchableOpacity>

                    </View>

                </SafeAreaView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'flex-end',
    },
    overlay: {
        width: '100%',
        backgroundColor: '#1C1C1E',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingBottom: 40,
        borderWidth: 1,
        borderColor: '#333',
    },
    safeArea: {
        width: '100%',
    },
    contentContainer: {
        paddingHorizontal: 24,
        paddingTop: 20,
        alignItems: 'center',
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(169, 222, 249, 0.1)', // #A9DEF9 with opacity
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    timeDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
        gap: 16,
    },
    timeSection: {
        alignItems: 'center',
        gap: 10,
    },
    timeValue: {
        color: '#FFF',
        fontSize: 48,
        fontWeight: 'bold',
        fontVariant: ['tabular-nums'],
    },
    timeLabel: {
        fontSize: 16,
        color: '#888',
        fontWeight: '600',
    },
    timeSeparator: {
        color: '#555',
        fontSize: 40,
        fontWeight: 'bold',
        paddingBottom: 20, // Align with digits
    },
    adjustBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionLabel: {
        color: '#888',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    qualityRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        width: '100%',
        marginBottom: 40,
    },
    qualityBtn: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: '#222',
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
        minWidth: '22%',
    },
    qualityText: {
        fontSize: 13,
        fontWeight: '600',
    },
    saveBtn: {
        width: '100%',
        height: 56,
        borderRadius: 28,
        overflow: 'hidden',
        shadowColor: '#A9DEF9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    saveGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
