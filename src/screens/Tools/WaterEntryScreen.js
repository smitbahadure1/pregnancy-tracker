import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Check, Droplet, Plus, Minus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { usePregnancy } from '../../context/PregnancyContext';

const { width } = Dimensions.get('window');

export default function WaterEntryScreen({ navigation }) {
    const { water, setWater, waterTarget } = usePregnancy();
    const [tempWater, setTempWater] = useState(water);

    const adjustWater = (amount) => {
        setTempWater(prev => {
            const newValue = prev + amount;
            return newValue > 0 ? newValue : 0;
        });
        Haptics.selectionAsync();
    };

    const handleSave = () => {
        setWater(tempWater);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigation.goBack();
    };

    const progress = Math.min((tempWater / waterTarget) * 100, 100);

    return (
        <View style={styles.container}>
            <View style={styles.overlay}>
                <SafeAreaView style={styles.safeArea}>

                    <View style={styles.contentContainer}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Hydration</Text>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                                <X size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        {/* Main Display */}
                        <View style={styles.displayContainer}>
                            <Text style={styles.waterValue}>
                                {tempWater}
                            </Text>
                            <Text style={styles.waterUnit}>ml</Text>
                        </View>

                        <Text style={styles.targetText}>target: {waterTarget}ml</Text>

                        {/* Visual Bar */}
                        <View style={styles.barContainer}>
                            <LinearGradient
                                colors={['#4CC9F0', '#4895EF']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[styles.barFill, { width: `${progress}%` }]}
                            />
                        </View>

                        {/* Controls */}
                        <View style={styles.controlsRow}>
                            <TouchableOpacity
                                onPress={() => adjustWater(-250)}
                                style={styles.controlBtn}
                            >
                                <Minus size={32} color="#FFF" />
                                <Text style={styles.btnLabel}>-250</Text>
                            </TouchableOpacity>

                            <View style={styles.divider} />

                            <TouchableOpacity
                                onPress={() => adjustWater(250)}
                                style={styles.controlBtn}
                            >
                                <Plus size={32} color="#FFF" />
                                <Text style={styles.btnLabel}>+250</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.hintText}>Tap to add/remove a glass (250ml)</Text>

                        {/* Save Button */}
                        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                            <LinearGradient
                                colors={['#4CC9F0', '#4895EF']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.saveGradient}
                            >
                                <Text style={styles.saveText}>Update Hydration</Text>
                                <Check size={20} color="#FFF" style={{ marginLeft: 8 }} />
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
    displayContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    waterValue: {
        fontSize: 72,
        fontWeight: 'bold',
        color: '#FFF',
        fontVariant: ['tabular-nums'],
    },
    waterUnit: {
        fontSize: 24,
        color: '#4CC9F0',
        marginBottom: 12,
        marginLeft: 8,
        fontWeight: '600',
    },
    targetText: {
        color: '#888',
        fontSize: 14,
        marginBottom: 24,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    barContainer: {
        width: '100%',
        height: 8,
        backgroundColor: '#333',
        borderRadius: 4,
        marginBottom: 40,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: 4,
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        borderRadius: 40,
        padding: 4,
        marginBottom: 16,
    },
    controlBtn: {
        width: 100,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        backgroundColor: '#444',
    },
    btnLabel: {
        color: '#CCC',
        fontSize: 12,
        marginTop: 4,
        fontWeight: '600',
    },
    divider: {
        width: 1,
        height: 50,
        backgroundColor: '#555',
        marginHorizontal: 10,
    },
    hintText: {
        color: '#888',
        fontSize: 12,
        marginBottom: 30,
    },
    saveBtn: {
        width: '100%',
        height: 56,
        borderRadius: 28,
        overflow: 'hidden',
        shadowColor: '#4CC9F0',
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
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
