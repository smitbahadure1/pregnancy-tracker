import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, BookOpen, ChevronRight, Heart, Check, Zap, User, Scale } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { usePregnancy } from '../../context/PregnancyContext';
import { INSIGHTS_DATA } from '../../data/insightsData';

const { width } = Dimensions.get('window');

// --- Sub-Components ---

const DailyTipCard = ({ tip }) => (
    <LinearGradient
        colors={['#1C1C1E', '#1C1C1E']}
        style={styles.tipCard}
    >
        <View style={styles.tipHeader}>
            <Zap size={16} color="#FFD93D" fill="#FFD93D" />
            <Text style={styles.tipLabel}>DAILY TIP</Text>
        </View>
        <Text style={styles.tipText}>{tip}</Text>
    </LinearGradient>
);

const PartnerCard = ({ tip }) => (
    <TouchableOpacity style={styles.partnerCard}>
        <LinearGradient
            colors={['#4361EE', '#3F37C9']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.partnerGradient}
        >
            <View style={styles.partnerHeader}>
                <View style={styles.partnerIconBg}>
                    <User size={14} color="#FFF" />
                </View>
                <Text style={styles.partnerLabel}>PARTNER'S CORNER</Text>
            </View>
            <Text style={styles.partnerText}>{tip}</Text>
        </LinearGradient>
    </TouchableOpacity>
);

const ChecklistCard = ({ trimester, items }) => {
    // Show only first 3 items for preview
    const previewItems = items.slice(0, 3);

    return (
        <View style={styles.checklistContainer}>
            <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Trimester {trimester} To-Do</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
            </View>

            {previewItems.map((item, index) => (
                <TouchableOpacity key={index} style={styles.checkItem} activeOpacity={0.7}>
                    <View style={styles.checkbox} />
                    <Text style={styles.checkText}>{item}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const GuideCard = ({ item }) => (
    <TouchableOpacity style={styles.guideCard}>
        <View style={[styles.guideImagePlaceholder, { backgroundColor: item.color }]}>
            {item.type === 'video' ? <Play size={24} color="#000" fill="#000" /> : <BookOpen size={24} color="#000" />}
        </View>
        <View style={styles.guideContent}>
            <Text style={[styles.guideCategory, { color: item.color }]}>{item.category}</Text>
            <Text style={styles.guideTitle}>{item.title}</Text>
            <Text style={styles.guideMeta}>{item.readTime} • {item.type === 'video' ? 'Video' : 'Article'}</Text>
        </View>
        <ChevronRight size={20} color="#333" />
    </TouchableOpacity>
);

const SymptomCard = ({ trimester }) => {
    const symptoms = INSIGHTS_DATA.symptoms[trimester] || [];

    return (
        <View style={styles.symptomContainer}>
            {symptoms.map((symptom, index) => (
                <View key={index} style={styles.symptomRow}>
                    <View style={styles.symptomIcon}>
                        <Check size={14} color="#FFD93D" strokeWidth={4} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.symptomName}>{symptom.name}</Text>
                        <Text style={styles.symptomRelief}>{symptom.relief}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
};

// --- Main Screen ---

export default function InsightsScreen() {
    const { stats } = usePregnancy();
    const currentWeek = stats ? stats.currentWeek : 12;
    const currentTrimester = stats ? stats.trimester : 1;

    // Memoize Data Selection
    const dailyTip = useMemo(() => {
        // Pick random tip based on day of month to correspond loosely (or random)
        const day = new Date().getDate();
        return INSIGHTS_DATA.dailyTips[day % INSIGHTS_DATA.dailyTips.length];
    }, []);

    const partnerTip = useMemo(() => {
        const day = new Date().getDay(); // Change daily
        return INSIGHTS_DATA.partnerTips[day % INSIGHTS_DATA.partnerTips.length];
    }, []);

    const relevantArticles = useMemo(() => {
        return INSIGHTS_DATA.articles.filter(
            article => currentWeek >= article.minWeek && currentWeek <= article.maxWeek
        );
    }, [currentWeek]);

    const checklistItems = INSIGHTS_DATA.checklists[currentTrimester] || [];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Insights</Text>
                    <Text style={styles.headerSubtitle}>Personalized for Week {currentWeek}</Text>
                </View>

                {/* Daily Tip */}
                <View style={styles.section}>
                    <DailyTipCard tip={dailyTip} />
                </View>

                {/* Checklist */}
                <ChecklistCard trimester={currentTrimester} items={checklistItems} />

                {/* Partner Tip */}
                <View style={styles.section}>
                    <PartnerCard tip={partnerTip} />
                </View>

                {/* Common Symptoms (Replaces Baby Growth) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Common Symptoms</Text>
                    <SymptomCard trimester={currentTrimester} />
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
    content: {
        paddingBottom: 100,
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
    section: {
        marginBottom: 30,
        paddingHorizontal: 20,
    },

    // Daily Tip
    tipCard: {
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    tipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 6,
    },
    tipLabel: {
        color: '#FFD93D',
        fontWeight: 'bold',
        fontSize: 12,
        letterSpacing: 1,
    },
    tipText: {
        color: '#FFF',
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '500',
    },

    // Partner
    partnerCard: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    partnerGradient: {
        padding: 20,
    },
    partnerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 8,
    },
    partnerIconBg: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    partnerLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontWeight: 'bold',
        fontSize: 11,
        letterSpacing: 1,
    },
    partnerText: {
        color: '#FFF',
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '500',
    },

    // Checklist
    checklistContainer: {
        marginBottom: 30,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFF',
    },
    seeAllText: {
        color: '#FF4D6D',
        fontWeight: '600',
        fontSize: 14,
    },
    checkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111',
        marginHorizontal: 20,
        marginBottom: 8,
        padding: 16,
        borderRadius: 16,
        gap: 16,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#444',
    },
    checkText: {
        color: '#DDD',
        fontSize: 15,
        fontWeight: '500',
    },

    // Guide Card
    guideCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        backgroundColor: '#111',
        padding: 12,
        borderRadius: 16,
    },
    guideImagePlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    guideContent: {
        flex: 1,
    },
    guideCategory: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    guideTitle: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        lineHeight: 20,
    },
    guideMeta: {
        color: '#666',
        fontSize: 12,
    },

    // Symptom Card
    symptomContainer: {
        backgroundColor: '#1C1C1E',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#333',
        gap: 20,
    },
    symptomRow: {
        flexDirection: 'row',
        gap: 16,
    },
    symptomIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 217, 61, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    symptomName: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    symptomRelief: {
        color: '#BBB',
        fontSize: 13,
        lineHeight: 18,
    }
});
