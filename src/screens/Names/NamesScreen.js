import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Search, X, Check, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const NAMES_DATA = [
    { id: '1', name: 'Luna', origin: 'Latin', meaning: 'Moon', gender: 'girl' },
    { id: '2', name: 'Oliver', origin: 'Latin', meaning: 'Olive Tree', gender: 'boy' },
    { id: '3', name: 'Aurora', origin: 'Latin', meaning: 'Dawn', gender: 'girl' },
    { id: '4', name: 'Felix', origin: 'Latin', meaning: 'Lucky, Successful', gender: 'boy' },
];

const NameCard = ({ data, onLike, onDislike }) => (
    <View style={styles.cardContainer}>
        <LinearGradient
            colors={['#1C1C1E', '#111']}
            style={styles.card}
        >
            <View style={styles.sparkleIcon}>
                <Sparkles size={24} color="#FFD93D" />
            </View>

            <View style={styles.nameContent}>
                <Text style={styles.nameText}>{data.name}</Text>
                <View style={styles.metaRow}>
                    <Text style={styles.originText}>{data.origin} • </Text>
                    <Text style={styles.meaningText}>{data.meaning}</Text>
                </View>
            </View>

            <View style={styles.actionsRow}>
                <TouchableOpacity style={[styles.actionBtn, styles.dislikeBtn]} onPress={onDislike}>
                    <X size={28} color="#FF4D6D" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.likeBtn]} onPress={onLike}>
                    <Heart size={28} color="#FFF" fill="#FFF" />
                </TouchableOpacity>
            </View>
        </LinearGradient>
    </View>
);

const FavoriteItem = ({ name, gender }) => (
    <View style={styles.favItem}>
        <View style={[styles.genderDot, { backgroundColor: gender === 'girl' ? '#FF99C8' : '#A9DEF9' }]} />
        <Text style={styles.favName}>{name}</Text>
        <Heart size={16} color="#FF4D6D" fill="#FF4D6D" />
    </View>
);

export default function NamesScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleLike = () => {
        if (currentIndex < NAMES_DATA.length - 1) setCurrentIndex(prev => prev + 1);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Baby Names</Text>
                    <Text style={styles.headerSubtitle}>Discover & Save Favorites</Text>
                </View>
                <TouchableOpacity style={styles.searchBtn}>
                    <Search size={22} color="#FFF" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Discovery Section - Card Stack Simulator */}
                <Text style={styles.sectionTitle}>Daily Suggestion</Text>
                <NameCard
                    data={NAMES_DATA[currentIndex]}
                    onLike={handleLike}
                    onDislike={handleLike}
                />

                {/* Categories */}
                <Text style={styles.sectionTitle}>Browse Collections</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
                    <TouchableOpacity style={styles.categoryCard}>
                        <LinearGradient colors={['#FF99C8', '#FF4D6D']} style={styles.categoryGradient}>
                            <Text style={styles.categoryText}>Top Girl Names</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.categoryCard}>
                        <LinearGradient colors={['#A9DEF9', '#4CC9F0']} style={styles.categoryGradient}>
                            <Text style={styles.categoryText}>Top Boy Names</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.categoryCard}>
                        <LinearGradient colors={['#E4C1F9', '#B5179E']} style={styles.categoryGradient}>
                            <Text style={styles.categoryText}>Unique / Rare</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>

                {/* Favorites List */}
                <View style={styles.favHeader}>
                    <Text style={styles.sectionTitle}>Your Favorites</Text>
                    <Text style={styles.seeAll}>See All (4)</Text>
                </View>

                <View style={styles.favList}>
                    <FavoriteItem name="Sophia" gender="girl" />
                    <FavoriteItem name="Noah" gender="boy" />
                    <FavoriteItem name="Isabella" gender="girl" />
                    <FavoriteItem name="Liam" gender="boy" />
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
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    searchBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1C1C1E',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    // Card
    cardContainer: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    card: {
        borderRadius: 30,
        padding: 30,
        height: 340,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    sparkleIcon: {
        alignSelf: 'flex-end',
    },
    nameContent: {
        alignItems: 'center',
    },
    nameText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 10,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    originText: {
        color: '#888',
        fontSize: 16,
        fontWeight: '600',
    },
    meaningText: {
        color: '#CCC',
        fontSize: 16,
        fontStyle: 'italic',
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 20,
        width: '100%',
        justifyContent: 'center',
    },
    actionBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    dislikeBtn: {
        backgroundColor: '#1A0505',
        borderColor: '#331111',
    },
    likeBtn: {
        backgroundColor: '#FF4D6D',
        borderColor: '#FF4D6D',
        shadowColor: '#FF4D6D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    // Categories
    categoryRow: {
        paddingHorizontal: 20,
        gap: 12,
        paddingBottom: 30,
    },
    categoryCard: {
        width: 140,
        height: 80,
        borderRadius: 20,
        overflow: 'hidden',
    },
    categoryGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 15,
    },
    // Favorites
    favHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 20,
        marginBottom: 10,
    },
    seeAll: {
        color: '#FF4D6D',
        fontWeight: '600',
    },
    favList: {
        paddingHorizontal: 20,
        gap: 12,
    },
    favItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        padding: 16,
        borderRadius: 16,
    },
    genderDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 16,
    },
    favName: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '600',
        flex: 1,
    }
});
