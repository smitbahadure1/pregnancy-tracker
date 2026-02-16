import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, NotebookPen, Calendar, Smile, Frown, Meh, Save, X, Footprints, Droplet, Moon, Scale } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { usePregnancy } from '../../context/PregnancyContext';

export default function JournalScreen() {
    const { history, updateLog } = usePregnancy();
    const [isWriting, setIsWriting] = useState(false);
    const [newEntry, setNewEntry] = useState('');
    const [mood, setMood] = useState(null);

    // Initial mock data that serves as examples but isn't overwhelming
    const [entries, setEntries] = useState([
        { id: 1, date: 'Oct 24', title: 'Big Announcement', text: 'We finally told our parents today! There were so many tears of joy.', mood: 'happy' },
    ]);

    // In handleSave, sync mood to global daily log
    const handleSave = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (!newEntry.trim()) return;

        // Sync mood to "Today's Log" for the weekly summary
        if (mood) {
            updateLog('mood', mood.charAt(0).toUpperCase() + mood.slice(1)); // Capitalize
        }

        const entry = {
            id: Date.now(),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            title: 'Daily Log',
            text: newEntry,
            mood: mood
        };

        setEntries([entry, ...entries]);
        setNewEntry('');
        setMood(null);
        setIsWriting(false);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Journal</Text>
                <Text style={styles.headerSubtitle}>Capture your thoughts & feelings</Text>
            </View>

            {/* Main Content */}
            {!isWriting ? (
                <>
                    <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
                        {/* Write Button Card */}
                        <TouchableOpacity
                            style={styles.writeCard}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setIsWriting(true);
                            }}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#FF4D6D', '#FF8FAB']}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                style={styles.writeGradient}
                            >
                                <View style={styles.writeIconBg}>
                                    <NotebookPen size={24} color="#FF4D6D" />
                                </View>
                                <View>
                                    <Text style={styles.writeTitle}>Write a new entry</Text>
                                    <Text style={styles.writeSubtitle}>How are you feeling today?</Text>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Weekly Summaries */}
                        {history && history.length > 0 && (
                            <View>
                                <Text style={styles.sectionTitle}>Weekly Summaries</Text>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ gap: 12, paddingRight: 20 }}
                                >
                                    {history.map((weekData, index) => (
                                        <View key={index} style={styles.summaryCard}>
                                            <View style={styles.summaryHeader}>
                                                <View>
                                                    <Text style={styles.summaryWeek}>Week {weekData.week}</Text>
                                                    <Text style={styles.summaryDate}>{weekData.startDate} - {weekData.endDate}</Text>
                                                </View>
                                                <View style={[styles.moodBadge,
                                                weekData.mood === 'Happy' && { backgroundColor: '#FFD93D20' },
                                                weekData.mood === 'Tired' && { backgroundColor: '#4CC9F020' },
                                                weekData.mood === 'Excited' && { backgroundColor: '#FF4D6D20' },
                                                ]}>
                                                    <Text style={[styles.moodText,
                                                    weekData.mood === 'Happy' && { color: '#FFD93D' },
                                                    weekData.mood === 'Tired' && { color: '#4CC9F0' },
                                                    weekData.mood === 'Excited' && { color: '#FF4D6D' },
                                                    ]}>{weekData.mood}</Text>
                                                </View>
                                            </View>

                                            <View style={styles.statsGrid}>
                                                <View style={styles.statItem}>
                                                    <Scale size={14} color="#E4C1F9" style={{ marginBottom: 4 }} />
                                                    <Text style={styles.statValue}>{weekData.avgWeight}</Text>
                                                    <Text style={styles.statLabel}>Avg Weight</Text>
                                                </View>
                                                <View style={styles.statItem}>
                                                    <Moon size={14} color="#A9DEF9" style={{ marginBottom: 4 }} />
                                                    <Text style={styles.statValue}>{weekData.avgSleep}</Text>
                                                    <Text style={styles.statLabel}>Avg Sleep</Text>
                                                </View>
                                                <View style={styles.statItem}>
                                                    <Droplet size={14} color="#4CC9F0" style={{ marginBottom: 4 }} />
                                                    <Text style={styles.statValue}>{weekData.avgWater}</Text>
                                                    <Text style={styles.statLabel}>Avg Water</Text>
                                                </View>
                                                <View style={styles.statItem}>
                                                    <Footprints size={14} color="#FF99C8" style={{ marginBottom: 4 }} />
                                                    <Text style={styles.statValue}>{weekData.totalKicks}</Text>
                                                    <Text style={styles.statLabel}>Total Kicks</Text>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        <Text style={styles.sectionTitle}>Recent Entries</Text>

                        {entries.map((entry) => (
                            <View key={entry.id} style={styles.entryCard}>
                                <View style={styles.entryHeader}>
                                    <View style={styles.dateBadge}>
                                        <Text style={styles.dateText}>{entry.date}</Text>
                                    </View>
                                    {entry.mood === 'happy' && <Smile size={20} color="#FFD93D" />}
                                    {entry.mood === 'sad' && <Frown size={20} color="#4CC9F0" />}
                                    {entry.mood === 'neutral' && <Meh size={20} color="#CCC" />}
                                </View>
                                <Text style={styles.entryTitle}>{entry.title}</Text>
                                <Text style={styles.entryText}>{entry.text}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </>
            ) : (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <View style={styles.editorContainer}>
                        <View style={styles.editorHeader}>
                            <TouchableOpacity onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setIsWriting(false);
                            }}>
                                <X size={24} color="#FFF" />
                            </TouchableOpacity>
                            <Text style={styles.editorTitle}>New Entry</Text>
                            <TouchableOpacity onPress={handleSave} disabled={!newEntry.trim()}>
                                <Text style={[styles.saveText, !newEntry.trim() && { opacity: 0.5 }]}>Save</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.moodSelector}>
                            <Text style={styles.label}>Mood:</Text>
                            <View style={{ flexDirection: 'row', gap: 16 }}>
                                <TouchableOpacity onPress={() => {
                                    Haptics.selectionAsync();
                                    setMood('happy');
                                }}>
                                    <Smile size={28} color={mood === 'happy' ? '#FFD93D' : '#333'} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    Haptics.selectionAsync();
                                    setMood('neutral');
                                }}>
                                    <Meh size={28} color={mood === 'neutral' ? '#CCC' : '#333'} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    Haptics.selectionAsync();
                                    setMood('sad');
                                }}>
                                    <Frown size={28} color={mood === 'sad' ? '#4CC9F0' : '#333'} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="Dear Baby..."
                            placeholderTextColor="#666"
                            multiline
                            value={newEntry}
                            onChangeText={setNewEntry}
                            autoFocus
                        />
                    </View>
                </KeyboardAvoidingView>
            )}
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
    list: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    sectionTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 12,
    },

    // Write Card
    writeCard: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 10,
    },
    writeGradient: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    writeIconBg: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    writeTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    writeSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
    },

    // Entry Card
    entryCard: {
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    dateBadge: {
        backgroundColor: '#333',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    dateText: {
        color: '#BBB',
        fontSize: 12,
        fontWeight: '600',
    },
    entryTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    entryText: {
        color: '#CCC',
        fontSize: 14,
        lineHeight: 20,
    },

    // Editor
    editorContainer: {
        flex: 1,
        padding: 20,
    },
    editorHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    editorTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    saveText: {
        color: '#FF4D6D',
        fontSize: 16,
        fontWeight: 'bold',
    },
    moodSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 20,
    },
    label: {
        color: '#888',
        fontSize: 16,
    },
    input: {
        flex: 1,
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        padding: 20,
        color: '#FFF',
        fontSize: 16,
        textAlignVertical: 'top',
    },

    // Weekly Summary
    summaryCard: {
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#333',
        width: 280,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    summaryWeek: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    summaryDate: {
        color: '#888',
        fontSize: 12,
    },
    moodBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    moodText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    statItem: {
        width: '47%',
        backgroundColor: '#2C2C2E',
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
    },
    statValue: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    statLabel: {
        color: '#888',
        fontSize: 10,
    },
});
