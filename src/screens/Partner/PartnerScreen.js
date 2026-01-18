import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Share2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { usePregnancy } from '../../context/PregnancyContext';

export default function PartnerScreen() {
    const { stats } = usePregnancy();
    const currentWeek = stats?.currentWeek || 12;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Heart size={60} color="#FF4D6D" fill="#FF4D6D" style={{ opacity: 0.8 }} />
                </View>

                <Text style={styles.title}>Partner Sync</Text>
                <Text style={styles.description}>
                    Share Week {currentWeek} updates, baby size, and symptoms with your partner automatically.
                </Text>

                <View style={styles.card}>
                    <View style={styles.cardRow}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>Not connected</Text>
                    </View>
                </View>

                <TouchableOpacity style={{ width: '100%', marginTop: 30 }}>
                    <LinearGradient
                        colors={['#FF4D6D', '#FF8FAB']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.button}
                    >
                        <Share2 size={20} color="#FFF" style={{ marginRight: 10 }} />
                        <Text style={styles.buttonText}>Invite Partner</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Learn more</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#1A1A1A',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        borderWidth: 1,
        borderColor: '#333',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
    },
    card: {
        backgroundColor: '#111',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginBottom: 20,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#666',
        marginRight: 10,
    },
    statusText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '600',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 30,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: 'bold',
    },
    secondaryButton: {
        marginTop: 20,
        padding: 10,
    },
    secondaryButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    }
});
