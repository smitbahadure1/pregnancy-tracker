import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { usePregnancy } from '../../context/PregnancyContext';
import { MILESTONES } from '../../data/journeyMilestones';

const { width } = Dimensions.get('window');

const MilestoneItem = ({ item, index, total, currentWeek, date }) => {
    const isCompleted = item.week < currentWeek;
    const isCurrent = item.week === currentWeek || (item.week > currentWeek && index > 0 && MILESTONES[index - 1].week < currentWeek && item.week === MILESTONES[index].week); // Logic simplified: simplest is just check week

    // Better logic: Find the next milestone that hasn't happened. Use that as "Next Up" or "Current Goal".
    // For this visual, "Current" is strictly the week match, OR if we are between milestones, the next one is "Up Next".

    let status = 'future';
    if (item.week < currentWeek) status = 'completed';
    else if (item.week === currentWeek) status = 'current';
    else if (index > 0 && MILESTONES[index - 1].week < currentWeek && item.week > currentWeek) status = 'next';

    const Icon = item.icon;

    return (
        <View style={styles.milestoneRow}>
            {/* Time Column */}
            <View style={styles.timeCol}>
                <Text style={[styles.weekLabel, (status === 'completed' || status === 'current') && styles.weekLabelActive]}>Week {item.week}</Text>
                <Text style={styles.dateLabel}>{date}</Text>
                {status === 'completed' && <Text style={styles.statusLabel}>Done</Text>}
                {status === 'current' && <Text style={[styles.statusLabel, { color: '#FF4D6D' }]}>Now</Text>}
            </View>

            {/* Line Column */}
            <View style={styles.lineCol}>
                <View style={[styles.topLine, index === 0 && { opacity: 0 }]} />

                <View style={[
                    styles.node,
                    status === 'completed' && styles.nodeDone,
                    status === 'current' && styles.nodeCurrent,
                    status === 'next' && styles.nodeNext
                ]}>
                    <Icon size={14} color={status === 'completed' || status === 'current' ? '#FFF' : '#666'} />
                </View>

                {index < total - 1 && (
                    <View style={[
                        styles.bottomLine,
                        (status === 'completed') && styles.bottomLineDone
                    ]} />
                )}
            </View>

            {/* Content Column */}
            <View style={styles.contentCol}>
                {status === 'current' ? (
                    <LinearGradient
                        colors={['#FF4D6D', '#FF8FAB']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={[styles.card, styles.cardCurrent]}
                    >
                        <Text style={styles.cardTitleCurrent}>{item.title}</Text>
                        <Text style={styles.cardDescCurrent}>{item.description}</Text>
                        <View style={styles.currentBadge}>
                            <Text style={styles.currentBadgeText}>HAPPENING NOW</Text>
                        </View>
                    </LinearGradient>
                ) : (
                    <View style={[
                        styles.card,
                        status === 'completed' && styles.cardDone,
                        status === 'next' && styles.cardNext
                    ]}>
                        <Text style={[styles.cardTitle, status === 'completed' && styles.cardTitleDone]}>{item.title}</Text>
                        <Text style={styles.cardDesc}>{item.description}</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default function JourneyScreen() {
    const { stats, dueDate } = usePregnancy();

    const getMilestoneDate = (week) => {
        if (!dueDate) return '';
        const due = new Date(dueDate);
        const start = new Date(due);
        start.setDate(due.getDate() - 280); // Conception approx

        const milestoneDate = new Date(start);
        milestoneDate.setDate(start.getDate() + (week * 7));

        return milestoneDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (!stats) return null;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Background Gradient Spot */}
            <LinearGradient
                colors={['rgba(255, 77, 109, 0.2)', 'transparent']}
                style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, borderRadius: 150 }}
            />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Journey</Text>
                <Text style={styles.headerSubtitle}>Week {stats.currentWeek} of 40</Text>
            </View>

            <View style={styles.progressHeader}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={styles.progressText}>{stats.progressPercent}% COMPLETED</Text>
                    <Text style={styles.progressText}>{stats.daysRemaining} DAYS LEFT</Text>
                </View>
                <View style={styles.progressBar}>
                    <LinearGradient
                        colors={['#FF4D6D', '#FF8FAB']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={{ width: `${stats.progressPercent}%`, height: '100%', borderRadius: 3 }}
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
                {MILESTONES.map((item, index) => (
                    <MilestoneItem
                        key={item.week}
                        item={item}
                        index={index}
                        total={MILESTONES.length}
                        currentWeek={stats.currentWeek}
                        date={getMilestoneDate(item.week)}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#FFF',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#888',
        marginTop: 4,
    },
    progressHeader: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    progressText: {
        color: '#FF4D6D',
        fontWeight: '700',
        fontSize: 11,
        letterSpacing: 1,
    },
    progressBar: {
        height: 6,
        backgroundColor: '#1C1C1E',
        borderRadius: 3,
        overflow: 'hidden',
    },
    list: {
        paddingBottom: 100,
        paddingRight: 20,
    },
    milestoneRow: {
        flexDirection: 'row',
        minHeight: 110,
    },
    timeCol: {
        width: 70,
        alignItems: 'flex-end',
        paddingRight: 10,
        paddingTop: 4,
    },
    weekLabel: {
        color: '#555',
        fontSize: 13,
        fontWeight: '600',
    },
    weekLabelActive: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    statusLabel: {
        fontSize: 10,
        color: '#666',
        fontWeight: '600',
        marginTop: 2,
        textTransform: 'uppercase',
    },

    // Timeline
    lineCol: {
        width: 40,
        alignItems: 'center',
    },
    topLine: {
        width: 2,
        height: 24,
        backgroundColor: '#333',
    },
    bottomLine: {
        position: 'absolute',
        top: 24, // Node center
        bottom: 0,
        width: 2,
        backgroundColor: '#333',
        zIndex: -1,
    },
    bottomLineDone: {
        backgroundColor: '#FF4D6D',
    },
    node: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#1C1C1E',
        borderWidth: 2,
        borderColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    nodeDone: {
        backgroundColor: '#FF4D6D',
        borderColor: '#FF4D6D',
    },
    nodeCurrent: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FF4D6D',
        borderColor: '#FFF',
        borderWidth: 3,
        marginLeft: -4, // Center align fix due to larger size
        shadowColor: '#FF4D6D',
        shadowOpacity: 0.6,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 },
        elevation: 10,
    },
    nodeNext: {
        borderColor: '#FF4D6D',
        backgroundColor: '#1C1C1E',
    },

    // Content
    contentCol: {
        flex: 1,
        paddingBottom: 24,
    },
    card: {
        backgroundColor: '#1C1C1E',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#333',
        justifyContent: 'center',
    },
    cardDone: {
        borderColor: '#333',
        opacity: 0.6, // Dim past events slightly
    },
    cardNext: {
        borderColor: '#444',
        borderWidth: 1,
        backgroundColor: '#222',
    },
    cardCurrent: {
        borderColor: '#FF4D6D',
        borderWidth: 0, // Gradient doesn't need border
        paddingVertical: 20,
        transform: [{ scale: 1.02 }], // Slight pop
    },
    cardTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    cardTitleDone: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
    cardDesc: {
        color: '#888',
        fontSize: 13,
        lineHeight: 18,
    },

    // Current Styles
    cardTitleCurrent: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    cardDescCurrent: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        lineHeight: 20,
    },
    currentBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        marginTop: 12,
    },
    currentBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
    },
});
