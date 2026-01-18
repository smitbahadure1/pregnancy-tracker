import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Droplet, Moon, Footprints, ChevronRight, Bell, Calendar, Sun, ArrowUpRight, Pill, Smile, Scale, Sparkles, Heart } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { dailyMantras } from '../../data/mantras';
import { usePregnancy } from '../../context/PregnancyContext';

const { width } = Dimensions.get('window');

const BentoCard = ({ children, style, height = 160, title, subtitle, icon: Icon, iconColor, titleColor = '#FFF', gradientColors }) => {
    const Container = gradientColors ? LinearGradient : View;
    const containerProps = gradientColors ? { colors: gradientColors, start: { x: 0, y: 0 }, end: { x: 1, y: 1 } } : {};

    return (
        <Container {...containerProps} style={[styles.bentoCard, { height }, style]}>
            {/* Header */}
            <View style={styles.cardHeader}>
                <View>
                    {title && <Text style={[styles.cardTitle, { color: titleColor }]}>{title}</Text>}
                    {subtitle && <Text style={[styles.cardSubtitle, { color: titleColor, opacity: 0.7 }]}>{subtitle}</Text>}
                </View>
                {Icon && (
                    <View style={[styles.iconCircle, { backgroundColor: iconColor + '20' }]}>
                        <Icon size={18} color={iconColor} />
                    </View>
                )}
            </View>

            {/* Content */}
            <View style={styles.cardContent}>
                {children}
            </View>
        </Container>
    );
};

const ProgressBar = ({ progress, color }) => (
    <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: color }]} />
    </View>
);

export default function TodayScreen({ navigation }) {
    const { stats, weight, water, waterTarget, sleep } = usePregnancy();

    // Get pseudo-random mantra based on date
    const today = new Date();
    const currentDate = today.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' }).toUpperCase();

    // Day of Year logic for Mantra
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const dailyMantra = dailyMantras[dayOfYear % dailyMantras.length];



    const [kickCount, setKickCount] = useState(12);

    const handleKick = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setKickCount(prev => prev + 1);
    };

    if (!stats) return null; // Or a loading state

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.dateText}>{currentDate}</Text>
                        <Text style={styles.greetingText}>Today</Text>
                    </View>
                    <TouchableOpacity style={styles.profileBtn}>
                        <View style={styles.avatar} />
                    </TouchableOpacity>
                </View>

                {/* BENTO GRID LAYOUT */}
                <View style={[styles.gridContainer, { marginBottom: 12 }]}>

                    {/* COL 1 */}
                    <View style={styles.column}>
                        {/* 1. Pregnancy Status (Tall) */}
                        <BentoCard
                            height={220}
                            style={{ backgroundColor: '#FF4D6D' }}
                            title={`Week ${stats.currentWeek}`}
                            subtitle={`Trimester ${stats.trimester}`}
                            icon={Calendar}
                            iconColor="#FFF"
                        >
                            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                <Text style={styles.bigStat}>Day {stats.currentDayOfWeek}</Text>
                                <Text style={styles.statLabel}>{stats.daysRemaining} Days to go</Text>
                                <View style={{ marginTop: 15 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                                        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' }}>PROGRESS</Text>
                                        <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>{stats.progressPercent}%</Text>
                                    </View>
                                    <View style={{ height: 6, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 3 }}>
                                        <View style={{ width: `${stats.progressPercent}%`, height: '100%', backgroundColor: '#FFF', borderRadius: 3 }} />
                                    </View>
                                </View>
                            </View>
                        </BentoCard>

                        {/* 3. Hydration (Small) */}
                        <TouchableOpacity onPress={() => navigation.navigate('WaterEntry')} activeOpacity={0.9}>
                            <BentoCard
                                height={140}
                                title="Water"
                                icon={Droplet}
                                iconColor="#004E64"
                                style={{ backgroundColor: '#4CC9F0' }}
                                titleColor="#004E64"
                            >
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text style={[styles.midStat, { color: '#004E64' }]}>{water.toLocaleString()}<Text style={{ fontSize: 16, color: '#004E64', opacity: 0.7 }}>ml</Text></Text>
                                    <Text style={[styles.subStat, { color: '#004E64', opacity: 0.8 }]}>Target: {waterTarget.toLocaleString()}ml</Text>
                                    <Text style={{ color: '#004E64', fontSize: 10, opacity: 0.6, marginTop: 4 }}>Tap to add</Text>
                                </View>
                            </BentoCard>
                        </TouchableOpacity>
                    </View>

                    {/* COL 2 */}
                    <View style={styles.column}>
                        {/* 2. Baby Size (Small) - Immersive Blend */}
                        <BentoCard
                            height={140}
                            style={{ backgroundColor: '#000', padding: 0, overflow: 'hidden' }}
                        >
                            <Image
                                source={require('../../../assets/fetus_week_12.png')}
                                style={{ width: '100%', height: '100%', opacity: 0.8, transform: [{ scale: 1.5 }, { translateY: 12 }] }}
                                resizeMode="cover"
                            />

                            {/* Overlay Header */}
                            <View style={{ position: 'absolute', top: 12, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Text style={[styles.cardTitle, { color: '#FFF', textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 4 }]}>Baby Size</Text>
                                <Sun size={18} color="#FFF" />
                            </View>

                            {/* Overlay Bottom */}
                            <View style={{ position: 'absolute', bottom: 12, left: 16 }}>
                                <Text style={[styles.subStat, { color: '#FFF', fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 4 }]}>Week {stats.currentWeek}</Text>
                            </View>
                        </BentoCard>

                        {/* 4. Did You Know? (Tall) */}
                        {/* 4. Daily Mantra (Tall) */}
                        <BentoCard
                            height={220}
                            title="Daily Mantra"
                            icon={Heart}
                            iconColor="#FF8FA3"
                            gradientColors={['#1c1c1e', '#000000']}
                            style={{ borderColor: '#333', borderWidth: 1 }}
                            titleColor="#FF8FA3"
                        >
                            <View style={{ flex: 1, paddingBottom: 5, paddingTop: 5, justifyContent: 'space-between' }}>
                                <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 4 }}>
                                    <Text
                                        style={{
                                            color: '#FFF',
                                            fontSize: 20, // Reduced from 22
                                            fontWeight: '400',
                                            textAlign: 'center',
                                            lineHeight: 28, // Reduced from 32
                                            fontStyle: 'italic',
                                        }}
                                        adjustsFontSizeToFit={true}
                                        minimumFontScale={0.8}
                                        numberOfLines={3}
                                    >
                                        "{dailyMantra}"
                                    </Text>
                                </View>

                                <View style={{ alignItems: 'center', marginBottom: 5 }}>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('Breathing')}
                                        style={{
                                            paddingHorizontal: 20,
                                            paddingVertical: 8,
                                            borderRadius: 30,
                                            backgroundColor: 'rgba(255, 143, 163, 0.15)',
                                            borderWidth: 1,
                                            borderColor: 'rgba(255, 143, 163, 0.3)'
                                        }}
                                    >
                                        <Text style={{ color: '#FF8FA3', fontSize: 12, fontWeight: '700', letterSpacing: 1 }}>BREATHE</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </BentoCard>
                    </View>
                </View>

                <View style={styles.gridContainer}>
                    {/* Col 1: Sleep (Tall) */}
                    <View style={styles.column}>
                        <TouchableOpacity onPress={() => navigation.navigate('SleepEntry')} activeOpacity={0.9}>
                            <BentoCard
                                height={212}
                                style={{ backgroundColor: '#A9DEF9' }}
                                title="Sleep"
                                titleColor="#000"
                                icon={Moon}
                                iconColor="#000"
                            >
                                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                    <Text style={[styles.bigStat, { color: '#000' }]}>{sleep.hours}<Text style={{ fontSize: 20 }}>h</Text> {sleep.minutes}<Text style={{ fontSize: 20 }}>m</Text></Text>
                                    <Text style={[styles.statLabel, { color: '#000', opacity: 0.6 }]}>Quality: {sleep.quality}</Text>
                                    <View style={{ marginTop: 10, backgroundColor: 'rgba(0,0,0,0.1)', height: 4, borderRadius: 2, width: '100%' }}>
                                        <View style={{ width: '85%', backgroundColor: '#000', height: '100%', borderRadius: 2 }} />
                                    </View>
                                    <Text style={{ color: '#000', fontSize: 10, opacity: 0.6, marginTop: 8 }}>Tap to log</Text>
                                </View>
                            </BentoCard>
                        </TouchableOpacity>
                    </View>

                    {/* Col 2: Stacked Stats */}
                    <View style={styles.column}>
                        {/* Weight */}
                        <TouchableOpacity onPress={() => navigation.navigate('WeightEntry')} activeOpacity={0.9}>
                            <BentoCard
                                height={100}
                                style={{ backgroundColor: '#E4C1F9' }}
                                title="Weight"
                                icon={Scale}
                                iconColor="#000"
                                titleColor="#000"
                            >
                                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                    <Text style={[styles.midStat, { color: '#000', fontSize: 26 }]}>{weight.toFixed(1)}<Text style={{ fontSize: 14, opacity: 0.6 }}>kg</Text></Text>
                                    <Text style={{ color: '#000', fontSize: 10, opacity: 0.6, marginTop: 4 }}>Tap to update</Text>
                                </View>
                            </BentoCard>
                        </TouchableOpacity>

                        {/* Kicks */}
                        {/* Kicks */}
                        <TouchableOpacity onPress={handleKick} activeOpacity={0.7}>
                            <BentoCard
                                height={100}
                                style={{ backgroundColor: '#FF99C8' }}
                                title="Kicks"
                                icon={Footprints}
                                iconColor="#000"
                                titleColor="#000"
                            >
                                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                    <Text style={[styles.midStat, { color: '#000', fontSize: 26 }]}>{kickCount}<Text style={{ fontSize: 14, opacity: 0.6 }}>x</Text></Text>
                                    <Text style={{ color: '#000', fontSize: 10, opacity: 0.6, marginTop: 4 }}>Tap to log</Text>
                                </View>
                            </BentoCard>
                        </TouchableOpacity>
                    </View>
                </View>


            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    header: {
        marginTop: 10,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateText: {
        color: '#888',
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 4,
        letterSpacing: 1,
    },
    greetingText: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: 'bold',
    },
    profileBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#222',
        borderWidth: 1,
        borderColor: '#333',
    },

    // Grid
    gridContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 30,
    },
    column: {
        flex: 1,
        gap: 12,
    },
    bentoCard: {
        backgroundColor: '#1C1C1E',
        borderRadius: 24,
        padding: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    cardSubtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        flex: 1,
    },

    // Stats
    bigStat: {
        color: '#FFF',
        fontSize: 36,
        fontWeight: 'bold',
        lineHeight: 40,
    },
    midStat: {
        color: '#FFF',
        fontSize: 28,
        fontWeight: 'bold',
    },
    statLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
        fontWeight: '500',
    },
    subStat: {
        color: '#888',
        fontSize: 12,
        fontWeight: '600',
    },

    // Insight
    tag: {
        backgroundColor: '#333',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 8,
    },
    tagText: {
        color: '#CCC',
        fontSize: 10,
        fontWeight: '700',
    },
    tipText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 24,
        marginBottom: 16,
    },
    readMoreBtn: {
        backgroundColor: '#333',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
    },
    readMoreText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },

    // Logs
    sectionHeader: {
        marginBottom: 16,
    },
    sectionTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    logRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    logItem: {
        flex: 1,
        backgroundColor: '#1C1C1E',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    logIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    logLabel: {
        color: '#888',
        fontSize: 12,
        marginBottom: 4,
    },
    logValue: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Date Box for Appointment
    dateBox: {
        backgroundColor: '#333',
        padding: 12,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 50,
    },
    dateMonth: {
        color: '#CCC',
        fontSize: 10,
        fontWeight: '700',
    },
    dateDay: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    // Vitamin Pill Check
    pillCheck: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Mood Emoji
    moodEmoji: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
});
