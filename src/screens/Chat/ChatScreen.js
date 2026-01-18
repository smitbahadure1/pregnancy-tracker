import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Lock, MessageSquare, MoreHorizontal } from 'lucide-react-native';

const CHAT_TOPICS = [
    { id: '1', title: 'TTC 2026 Support Group', messages: 1240, active: '2m ago' },
    { id: '2', title: 'Early Pregnancy Symptoms', messages: 856, active: '5m ago' },
    { id: '3', title: 'Ovulation Tracking Help', messages: 432, active: '1h ago' },
    { id: '4', title: 'Mental Health Check-in', messages: 120, active: '3h ago' },
    { id: '5', title: 'Diet & Nutrition', messages: 89, active: '1d ago' },
];

const ChatItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem}>
        <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
                <Lock size={16} color="#FFF" />
            </View>
        </View>
        <View style={styles.chatContent}>
            <Text style={styles.chatTitle}>{item.title}</Text>
            <Text style={styles.chatMeta}>{item.messages} messages • Active {item.active}</Text>
        </View>
        <MoreHorizontal size={20} color="#666" />
    </TouchableOpacity>
);

export default function ChatScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Secret Chats</Text>
                    <Text style={styles.headerSubtitle}>Anonymous & Safe</Text>
                </View>
                <TouchableOpacity style={styles.searchButton}>
                    <Search size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.actionsBar}>
                <TouchableOpacity style={styles.pillButton}>
                    <Text style={styles.pillText}>My Topics</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.pillButton, styles.pillDimmed]}>
                    <Text style={[styles.pillText, styles.pillTextDimmed]}>Discover</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={CHAT_TOPICS}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <ChatItem item={item} />}
                contentContainerStyle={styles.listContent}
            />
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
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#FFF',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#888',
        fontWeight: '600',
        marginTop: 4,
    },
    searchButton: {
        width: 44,
        height: 44,
        backgroundColor: '#1A1A1A',
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionsBar: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
        gap: 12,
    },
    pillButton: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    pillDimmed: {
        backgroundColor: '#1A1A1A',
    },
    pillText: {
        color: '#000',
        fontWeight: '600',
    },
    pillTextDimmed: {
        color: '#FFF',
    },
    listContent: {
        paddingHorizontal: 20,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#111',
    },
    avatarContainer: {
        marginRight: 16,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#1F1F1F',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    chatContent: {
        flex: 1,
    },
    chatTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#FFF',
        marginBottom: 4,
    },
    chatMeta: {
        fontSize: 13,
        color: '#666',
    }
});
