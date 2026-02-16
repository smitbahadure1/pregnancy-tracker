import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Plus, Share2, MoreHorizontal, Image as ImageIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { usePregnancy } from '../../context/PregnancyContext';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

// Mock Data
const MEMORIES = [
    { id: '1', type: 'photo', week: 12, date: 'Dec 19', color: '#FF99C8', height: 200 },
    { id: '2', type: 'note', title: 'First Kick!', content: 'Felt a tiny flutter today while watching TV.', date: 'Dec 15', color: '#A9DEF9', height: 160 },
    { id: '3', type: 'photo', week: 8, date: 'Nov 21', color: '#E4C1F9', height: 220 },
    { id: '4', type: 'cravings', title: 'Craving Pickles', content: 'So weird, but I need them NOW.', date: 'Nov 10', color: '#D0F4DE', height: 140 },
    { id: '5', type: 'photo', week: 4, date: 'Oct 24', color: '#FFD93D', height: 180 },
];

const PhotoCard = ({ item }) => (
    <TouchableOpacity style={[styles.cardContainer, { height: item.height }]}>
        {item.uri ? (
            <Image source={{ uri: item.uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        ) : (
            <View style={[styles.photoPlaceholder, { backgroundColor: item.color }]}>
                <ImageIcon size={32} color="rgba(0,0,0,0.3)" />
                <View style={styles.weekBadge}>
                    <Text style={styles.weekBadgeText}>Week {item.week}</Text>
                </View>
            </View>
        )}
        <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.photoOverlay}
        >
            <Text style={styles.cardDate}>{item.date}</Text>
        </LinearGradient>
    </TouchableOpacity>
);

const NoteCard = ({ item }) => (
    <TouchableOpacity style={[styles.cardContainer, { height: item.height }]}>
        <View style={[styles.noteContainer, { backgroundColor: '#1C1C1E' }]}>
            <Text style={[styles.noteTitle, { color: item.color }]}>{item.title}</Text>
            <Text style={styles.noteContent}>{item.content}</Text>
            <Text style={styles.noteDate}>{item.date}</Text>
        </View>
    </TouchableOpacity>
);

export default function MemoriesScreen() {
    const { stats } = usePregnancy();
    const currentWeek = stats?.currentWeek || 12;
    const [memories, setMemories] = useState(MEMORIES);
    const [permission, requestPermission] = ImagePicker.useCameraPermissions();

    const handleCamera = async () => {
        if (!permission) return;
        
        if (!permission.granted) {
            const { granted } = await requestPermission();
            if (!granted) {
                Alert.alert("Permission Required", "Please allow camera access to take photos of your bump journey.");
                return;
            }
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
            aspect: [4, 5],
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const newPhoto = {
                id: Date.now().toString(),
                type: 'photo',
                week: currentWeek,
                date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
                color: '#FF99C8',
                height: 220, // Standard height for new photos
                uri: result.assets[0].uri
            };
            setMemories(prev => [newPhoto, ...prev]);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Bump Gallery</Text>
                    <Text style={styles.headerSubtitle}>Your Week {currentWeek} Highlights</Text>
                </View>
                <TouchableOpacity style={styles.cameraBtn} onPress={handleCamera}>
                    <Camera size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            {/* Masonry-style Grid Simulator (2 Columns) */}
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.masonryContainer}>
                    {/* Left Column */}
                    <View style={styles.column}>
                        <TouchableOpacity style={styles.addCard} onPress={handleCamera}>
                            <View style={styles.addIcon}>
                                <Plus size={32} color="#FFF" />
                            </View>
                            <Text style={styles.addText}>Add Week {currentWeek} Photo</Text>
                        </TouchableOpacity>
                        {memories.filter((_, i) => i % 2 === 0).map(item => (
                            item.type === 'photo' ? <PhotoCard key={item.id} item={item} /> : <NoteCard key={item.id} item={item} />
                        ))}
                    </View>

                    {/* Right Column */}
                    <View style={styles.column}>
                        {memories.filter((_, i) => i % 2 !== 0).map(item => (
                            item.type === 'photo' ? <PhotoCard key={item.id} item={item} /> : <NoteCard key={item.id} item={item} />
                        ))}
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
    cameraBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#1C1C1E',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    masonryContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 16,
    },
    column: {
        width: COLUMN_WIDTH,
        gap: 16,
    },
    // Add Card
    addCard: {
        height: 180,
        borderRadius: 24,
        backgroundColor: '#111',
        borderWidth: 2,
        borderColor: '#333',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    addIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FF4D6D',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16,
    },
    // Cards
    cardContainer: {
        borderRadius: 24,
        overflow: 'hidden',
        // marginBottom: 16, // handled by gap
    },
    photoPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    weekBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    weekBadgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    photoOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        paddingTop: 40,
    },
    cardDate: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    // Note Card
    noteContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#333',
    },
    noteTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    noteContent: {
        color: '#CCC',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },
    noteDate: {
        color: '#666',
        fontSize: 12,
        alignSelf: 'flex-end',
    }
});
