import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Timer, Footprints, Weight, Briefcase, FileText, Activity, Music, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ToolCard = ({ icon: Icon, title, desc, color }) => (
    <TouchableOpacity style={styles.toolCard}>
        <LinearGradient
            colors={['#1C1C1E', '#111']}
            style={styles.cardGradient}
        >
            <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
                <Icon size={28} color={color} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.toolTitle}>{title}</Text>
                <Text style={styles.toolDesc}>{desc}</Text>
            </View>
            <ChevronRight size={20} color="#333" />
        </LinearGradient>
    </TouchableOpacity>
);

const QuickAction = ({ icon: Icon, label, color }) => (
    <TouchableOpacity style={styles.quickAction}>
        <View style={[styles.quickIcon, { backgroundColor: color }]}>
            <Icon size={24} color="#000" />
        </View>
        <Text style={styles.quickLabel}>{label}</Text>
    </TouchableOpacity>
);

export default function ToolsScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Pregnancy Tools</Text>
                    <Text style={styles.headerSubtitle}>Everything you need for the big day</Text>
                </View>

                {/* Primary Tools - Labor & Delivery */}
                <Text style={styles.sectionTitle}>Labor & Delivery</Text>
                <View style={styles.toolsList}>
                    <ToolCard
                        icon={Timer}
                        title="Contraction Timer"
                        desc="Track frequency and duration"
                        color="#FF4D6D"
                    />
                    <ToolCard
                        icon={Briefcase}
                        title="Hospital Bag"
                        desc="Checklist for Mom, Dad & Baby"
                        color="#4CC9F0"
                    />
                    <ToolCard
                        icon={FileText}
                        title="Birth Plan"
                        desc="Exportable PDF for your doctor"
                        color="#FFD93D"
                    />
                </View>

                {/* Tracking Tools */}
                <Text style={styles.sectionTitle}>Daily Tracking</Text>
                <View style={styles.quickRow}>
                    <QuickAction icon={Footprints} label="Kicks" color="#FF99C8" />
                    <QuickAction icon={Weight} label="Weight" color="#A9DEF9" />
                    <QuickAction icon={Activity} label="Kegel" color="#E4C1F9" />
                    <QuickAction icon={Music} label="Zen" color="#D0F4DE" />
                </View>

                {/* Export / Report */}
                <TouchableOpacity style={styles.exportCard}>
                    <LinearGradient
                        colors={['#333', '#222']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={styles.exportGradient}
                    >
                        <View>
                            <Text style={styles.exportTitle}>Export Health Report</Text>
                            <Text style={styles.exportDesc}>PDF summary for your next visit</Text>
                        </View>
                        <View style={styles.downloadIcon}>
                            <FileText size={20} color="#FFF" />
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

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
        marginBottom: 30,
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    // Tools List
    toolsList: {
        paddingHorizontal: 20,
        gap: 16,
        marginBottom: 30,
    },
    toolCard: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#333',
    },
    cardGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 16,
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    toolTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    toolDesc: {
        color: '#888',
        fontSize: 14,
    },
    // Quick Row
    quickRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    quickAction: {
        alignItems: 'center',
        gap: 8,
    },
    quickIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quickLabel: {
        color: '#CCC',
        fontSize: 13,
        fontWeight: '500',
    },
    // Export
    exportCard: {
        marginHorizontal: 20,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#333',
    },
    exportGradient: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    exportTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    exportDesc: {
        color: '#888',
        fontSize: 13,
        marginTop: 4,
    },
    downloadIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#444',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
