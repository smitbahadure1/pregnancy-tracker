import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Check, Minus, Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { usePregnancy } from '../../context/PregnancyContext';

const { width } = Dimensions.get('window');

export default function WeightEntryScreen({ navigation }) {
    const { weight, setWeight } = usePregnancy();

    const adjustWeight = (amount) => {
        setWeight(prev => {
            const newValue = Math.round((prev + amount) * 10) / 10;
            return newValue > 0 ? newValue : 0;
        });
        Haptics.selectionAsync();
    };

    const handleSave = () => {
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
                            <Text style={styles.title}>Log Weight</Text>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                                <X size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        {/* Main Weight Display */}
                        <View style={styles.displayContainer}>
                            <Text style={styles.weightValue}>
                                {weight.toFixed(1)}
                            </Text>
                            <Text style={styles.weightUnit}>kg</Text>
                        </View>

                        {/* Controls */}
                        <View style={styles.controlsRow}>
                            <TouchableOpacity
                                onPress={() => adjustWeight(-0.1)}
                                onLongPress={() => adjustWeight(-1.0)}
                                style={styles.controlBtn}
                            >
                                <Minus size={32} color="#FFF" />
                            </TouchableOpacity>

                            <View style={styles.divider} />

                            <TouchableOpacity
                                onPress={() => adjustWeight(0.1)}
                                onLongPress={() => adjustWeight(1.0)}
                                style={styles.controlBtn}
                            >
                                <Plus size={32} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.hintText}>Tap for 0.1kg • Hold for 1kg</Text>

                        {/* Save Button */}
                        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                            <LinearGradient
                                colors={['#E4C1F9', '#D091F2']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.saveGradient}
                            >
                                <Text style={styles.saveText}>Update Weight</Text>
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
        backgroundColor: 'rgba(0,0,0,0.85)', // Semi-transparent black backdrop
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
        marginBottom: 30,
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
        marginBottom: 40,
    },
    weightValue: {
        fontSize: 72,
        fontWeight: 'bold',
        color: '#FFF',
        fontVariant: ['tabular-nums'],
    },
    weightUnit: {
        fontSize: 24,
        color: '#E4C1F9', // Light Purple
        marginBottom: 12,
        marginLeft: 8,
        fontWeight: '600',
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
        width: 80,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        backgroundColor: '#444',
    },
    divider: {
        width: 1,
        height: 40,
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
        shadowColor: '#E4C1F9',
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
