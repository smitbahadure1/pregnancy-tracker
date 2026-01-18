import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Footprints, Minus, Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function KickCounterScreen({ navigation }) {
    const [kickCount, setKickCount] = useState(0);
    const [scaleAnim] = useState(new Animated.Value(1));
    const [lastKickTime, setLastKickTime] = useState(null);

    const handleKick = useCallback(() => {
        // Haptic Feedback
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Animation
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.2,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            })
        ]).start();

        // Increment count
        setKickCount(prev => prev + 1);
        setLastKickTime(new Date());

    }, []);

    const decrementKick = () => {
        if (kickCount > 0) {
            setKickCount(prev => prev - 1);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const resetCount = () => {
        setKickCount(0);
        setLastKickTime(null);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };


    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                        <X size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Kick Counter</Text>
                    <View style={{ width: 44 }} />
                </View>

                {/* Main Action Area */}
                <View style={styles.content}>

                    <Text style={styles.instruction}>Tap the footprint to log a kick</Text>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleKick}
                        style={styles.kickButtonContainer}
                    >
                        <Animated.View style={[styles.kickCircle, { transform: [{ scale: scaleAnim }] }]}>
                            <Footprints size={80} color="#FFF" fill="#FFF" />
                        </Animated.View>
                    </TouchableOpacity>

                    {/* Counter Display */}
                    <View style={styles.counterContainer}>
                        <Text style={styles.countText}>{kickCount}</Text>
                        <Text style={styles.label}>KICKS TODAY</Text>
                    </View>

                    {lastKickTime && (
                        <Text style={styles.lastKickLabel}>
                            Last kick: {lastKickTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    )}

                    {/* Adjusters */}
                    <View style={styles.adjustRow}>
                        <TouchableOpacity onPress={decrementKick} style={styles.adjustBtn}>
                            <Minus size={24} color="#FFF" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={resetCount} style={[styles.adjustBtn, styles.resetBtn]}>
                            <Text style={styles.resetText}>RESET</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleKick} style={styles.adjustBtn}>
                            <Plus size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                </View>

            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    closeButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 40,
    },
    instruction: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 16,
        marginBottom: 40,
    },
    kickButtonContainer: {
        marginBottom: 40,
    },
    kickCircle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#FF99C8', // Pink
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FF99C8',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 10,
    },
    counterContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    countText: {
        color: '#FFF',
        fontSize: 80,
        fontWeight: 'bold',
        lineHeight: 80,
    },
    label: {
        color: '#FF99C8',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 2,
        marginTop: 10,
    },
    lastKickLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        marginBottom: 40,
    },
    adjustRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    adjustBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#1C1C1E',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    resetBtn: {
        width: 100,
        borderRadius: 30,
    },
    resetText: {
        color: '#FF4D6D', // Reddish pink
        fontWeight: 'bold',
        fontSize: 14,
    }
});
