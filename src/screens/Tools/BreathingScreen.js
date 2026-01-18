import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Play } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function BreathingScreen({ navigation }) {
    const [phase, setPhase] = useState('Inhale'); // Inhale, Hold, Exhale, Hold

    // Animation Values
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // Wave Animation: When scale is 1 (Exhale), wave is HIGH (negative translate). When 1.5 (Inhale), wave is LOW (positive).
    const waveTranslateY = scaleAnim.interpolate({
        inputRange: [1, 1.5],
        outputRange: [-height * 0.4, 100]
    });

    const inhaleOpacity = scaleAnim.interpolate({
        inputRange: [1, 1.25, 1.5],
        outputRange: [0, 0, 1]
    });

    const exhaleOpacity = scaleAnim.interpolate({
        inputRange: [1, 1.25, 1.5],
        outputRange: [1, 0, 0]
    });

    useEffect(() => {
        const breatheCycle = () => {
            // Inhale: 4s
            setPhase('Inhale');
            Animated.timing(scaleAnim, {
                toValue: 1.5,
                duration: 4000,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start(() => {
                // Hold: 2s
                setPhase('Hold');
                setTimeout(() => {
                    // Exhale: 4s
                    setPhase('Exhale');
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 4000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }).start(() => {
                        // Hold: 2s
                        setPhase('Hold');
                        setTimeout(() => {
                            breatheCycle();
                        }, 2000);
                    });
                }, 2000);
            });
        };

        breatheCycle();

        return () => {
            scaleAnim.stopAnimation();
        };
    }, []);

    return (
        <View style={styles.container}>
            {/* Close Button */}
            <SafeAreaView style={styles.safeArea}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <X size={24} color="#FFF" />
                </TouchableOpacity>
            </SafeAreaView>

            {/* Bottom Curvature (Pink Wave) */}
            <View style={styles.seaContainer}>
                <Animated.View
                    style={[
                        styles.seaCurve,
                        { transform: [{ translateY: waveTranslateY }] }
                    ]}
                />
            </View>

            {/* Breathing Circle (Sun/Face) */}
            <Animated.View style={[styles.sunCircle, { transform: [{ scale: scaleAnim }] }]}>
                {/* Face */}
                <View style={styles.faceContainer}>
                    <View style={styles.eyesRow}>
                        {/* Simplified Arched Eyes */}
                        <View style={styles.eye} />
                        <View style={styles.eye} />
                    </View>
                    <View style={styles.smile} />
                </View>

                {/* Inhale Text Group (Inside Circle) */}
                <Animated.View style={{ alignItems: 'center', marginTop: 80, opacity: inhaleOpacity }}>
                    <Play size={24} color="#FFF" fill="#FFF" style={{ marginBottom: 4 }} />
                    <Text style={styles.phaseText}>Inhale</Text>
                </Animated.View>
            </Animated.View>

            {/* Exhale Text (Outside, on top of wave) */}
            <Animated.View style={[styles.exhaleTextContainer, { opacity: exhaleOpacity }]}>
                <Text style={styles.exhaleText}>Exhale</Text>
            </Animated.View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000', // Black background
        alignItems: 'center',
        justifyContent: 'center',
    },
    safeArea: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginRight: 20,
        marginTop: 10,
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
    },

    // Wave
    seaContainer: {
        position: 'absolute',
        bottom: 0,
        width: width,
        height: height * 0.25,
        overflow: 'hidden',
    },
    seaCurve: {
        width: width * 2,       // Very wide for flatter top curve
        height: height * 0.8,
        borderRadius: width,    // Smooth wide radius
        backgroundColor: '#FF4D6D', // Pink
        position: 'absolute',
        top: 0,
        left: -width * 0.5,     // Centered
    },

    // Sun / Sphere
    sunCircle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#FF8FAB', // Lighter Pink
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FF4D6D',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 40,
        elevation: 10,
    },
    phaseText: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: 'bold',
    },
    exhaleTextContainer: {
        position: 'absolute',
        bottom: height * 0.42, // Adjusted for new wave height
        width: '100%',
        alignItems: 'center',
        zIndex: 20,
    },
    exhaleText: {
        color: '#FFF',
        fontSize: 40,
        fontWeight: 'bold',
    },

    // Face
    faceContainer: {
        position: 'absolute',
        top: 30, // Moved up further
        alignItems: 'center',
    },
    eyesRow: {
        flexDirection: 'row',
        gap: 34,
        marginBottom: 8,
    },
    eye: {
        width: 32,
        height: 16,
        borderTopWidth: 3,
        borderTopColor: '#FFF',
        borderRadius: 16,
    },
    smile: {
        width: 60,
        height: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        borderBottomWidth: 6,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 0,
        borderColor: '#FFF',
        backgroundColor: 'transparent',
    }
});
