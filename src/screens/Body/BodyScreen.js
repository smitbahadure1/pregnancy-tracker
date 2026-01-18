import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { Ruler, Weight, Info } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { usePregnancy } from '../../context/PregnancyContext';

const { width, height } = Dimensions.get('window');


const IMAGES = {
    early: require('../../../assets/fetus_week_12.png'),
    mid: require('../../../assets/fetus_week_24.png'),
    late: require('../../../assets/fetus_week_36.png'),
};

const StatBox = ({ icon: Icon, label, value, color }) => (
    <View style={styles.statBox}>
        <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
            <Icon size={18} color={color} />
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

export default function BodyScreen() {
    const { stats } = usePregnancy();
    const [week, setWeek] = useState(stats?.currentWeek || 12);

    // Animation refs
    const fadeEarly = useRef(new Animated.Value(1)).current;
    const fadeMid = useRef(new Animated.Value(0)).current;
    const fadeLate = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (stats?.currentWeek) {
            setWeek(stats.currentWeek);
        }
    }, [stats]);

    useEffect(() => {
        let targetEarly = 0;
        let targetMid = 0;
        let targetLate = 0;

        if (week < 18) {
            targetEarly = 1;
        } else if (week >= 18 && week < 28) {
            targetMid = 1;
        } else {
            targetLate = 1;
        }

        Animated.parallel([
            Animated.timing(fadeEarly, { toValue: targetEarly, duration: 500, useNativeDriver: true }),
            Animated.timing(fadeMid, { toValue: targetMid, duration: 500, useNativeDriver: true }),
            Animated.timing(fadeLate, { toValue: targetLate, duration: 500, useNativeDriver: true }),
        ]).start();

    }, [week]);

    const handleSlide = (value) => {
        if (value !== week) {
            setWeek(value);
            Haptics.selectionAsync();
        }
    };

    const getLength = (w) => (w * 1.2).toFixed(1) + ' cm';
    const getWeight = (w) => {
        if (w < 12) return '< 15g';
        const g = Math.pow(w, 2.3) * 0.5;
        return g > 1000 ? (g / 1000).toFixed(2) + ' kg' : g.toFixed(0) + ' g';
    };

    return (
        <View style={styles.container}>
            {/* IMMERSIVE BACKGROUND & IMAGES */}
            <LinearGradient
                colors={['#000', '#1A0510', '#000']}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.imageContainer}>
                <Animated.Image
                    source={IMAGES.early}
                    style={[styles.fetusImage, { opacity: fadeEarly }]}
                    resizeMode="contain"
                />
                <Animated.Image
                    source={IMAGES.mid}
                    style={[styles.fetusImage, { opacity: fadeMid }]}
                    resizeMode="contain"
                />
                <Animated.Image
                    source={IMAGES.late}
                    style={[styles.fetusImage, { opacity: fadeLate }]}
                    resizeMode="contain"
                />
            </View>

            {/* UI OVERLAY */}
            <SafeAreaView style={styles.uiOverlay} edges={['top']} pointerEvents="box-none">

                {/* Top Info Bar */}
                <View style={styles.topBar}>
                    <View>
                        <Text style={styles.headerTitle}>Week {week}</Text>
                        <Text style={styles.headerSubtitle}>Baby Journey</Text>
                    </View>
                    <View style={styles.statsRow}>
                        <StatBox icon={Ruler} label="Length" value={getLength(week)} color="#4CC9F0" />
                        <StatBox icon={Weight} label="Weight" value={getWeight(week)} color="#FFD93D" />
                    </View>
                </View>

                {/* Invisible spacer to push header up and slider down */}
                <View style={{ flex: 1 }} pointerEvents="none" />

                {/* Minimal Bottom Controls */}
                <View style={styles.bottomControls}>
                    <Text style={styles.sliderLabel}>Slide to Travel</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={1}
                        maximumValue={40}
                        step={1}
                        value={week}
                        onValueChange={handleSlide}
                        minimumTrackTintColor="#FF4D6D"
                        maximumTrackTintColor="#333"
                        thumbTintColor="#FF4D6D"
                    />
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
    uiOverlay: {
        flex: 1,
        justifyContent: 'space-between',
    },
    // Top Bar
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 10,
        backgroundColor: 'transparent',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#FF4D6D',
        fontWeight: '600',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 16,
    },
    statBox: {
        alignItems: 'flex-end',
    },
    statIcon: {
        display: 'none', // Too noisy for top bar
    },
    statValue: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    statLabel: {
        color: '#888',
        fontSize: 10,
        marginTop: 2,
    },

    // Full Screen Images - Adjusted to be unobscured
    imageContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        top: 20, // Nudge down slightly from top bar
        bottom: 80, // Nudge up from slider
    },
    fetusImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },

    // Bottom Controls
    bottomControls: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        backgroundColor: 'transparent', // Transparent!
    },
    sliderLabel: {
        color: '#444',
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    slider: {
        width: '100%',
        height: 40,
    },
});
