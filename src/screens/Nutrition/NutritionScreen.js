import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Info, Check, AlertTriangle, XCircle, ChevronRight, Apple, Coffee, Fish, Pizza } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { usePregnancy } from '../../context/PregnancyContext';

const { width } = Dimensions.get('window');

const FOOD_CATEGORIES = [
    { id: '1', label: 'Cheese', icon: Pizza, color: '#FFD93D' },
    { id: '2', label: 'Fish', icon: Fish, color: '#4CC9F0' },
    { id: '3', label: 'Fruit', icon: Apple, color: '#FF4D6D' },
    { id: '4', label: 'Dreams', icon: Coffee, color: '#A9DEF9' },
];

const FOOD_ITEMS = [
    { id: '1', name: 'Sushi (Raw)', status: 'avoid', icon: '🍣' },
    { id: '2', name: 'Soft Cheese', status: 'caution', icon: '🧀' },
    { id: '3', name: 'Coffee', status: 'caution', limit: '200mg/day', icon: '☕' },
    { id: '4', name: 'Salmon', status: 'safe', icon: '🐟' },
    { id: '5', name: 'Eggs (Cooked)', status: 'safe', icon: '🥚' },
    { id: '6', name: 'Deli Meat', status: 'avoid', icon: '🍖' },
];

const StatusBadge = ({ status }) => {
    let color = '#4CC9F0';
    let icon = Check;
    let label = 'Safe';

    if (status === 'caution') {
        color = '#FFD93D';
        icon = AlertTriangle;
        label = 'Caution';
    } else if (status === 'avoid') {
        color = '#FF4D6D';
        icon = XCircle;
        label = 'Avoid';
    }

    const IconComp = icon;

    return (
        <View style={[styles.statusBadge, { backgroundColor: color + '20', borderColor: color }]}>
            <IconComp size={12} color={color} />
            <Text style={[styles.statusText, { color: color }]}>{label}</Text>
        </View>
    );
};

const FoodItem = ({ item }) => (
    <TouchableOpacity style={styles.foodItem}>
        <View style={styles.foodIconBox}>
            <Text style={{ fontSize: 24 }}>{item.icon}</Text>
        </View>
        <View style={styles.foodInfo}>
            <Text style={styles.foodName}>{item.name}</Text>
            {item.limit && <Text style={styles.foodLimit}>{item.limit}</Text>}
        </View>
        <StatusBadge status={item.status} />
    </TouchableOpacity>
);

export default function NutritionScreen() {
    const { stats } = usePregnancy();
    const currentWeek = stats?.currentWeek || 12;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Food Safety</Text>
                <Text style={styles.headerSubtitle}>Week {currentWeek} Nutrition Guide</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Search size={20} color="#666" />
                    <TextInput
                        placeholder="Search for a food..."
                        placeholderTextColor="#666"
                        style={styles.searchInput}
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Categories */}
                <Text style={styles.sectionTitle}>Browse Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
                    {FOOD_CATEGORIES.map(cat => (
                        <TouchableOpacity key={cat.id} style={styles.catCard}>
                            <View style={[styles.catIcon, { backgroundColor: cat.color + '20' }]}>
                                <cat.icon size={24} color={cat.color} />
                            </View>
                            <Text style={styles.catLabel}>{cat.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Popular Search */}
                <View style={styles.listHeader}>
                    <Text style={styles.sectionTitle}>Common Queries</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>View All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.list}>
                    {FOOD_ITEMS.map(item => (
                        <FoodItem key={item.id} item={item} />
                    ))}
                </View>

                {/* Hydration Card (Bonus) */}
                <TouchableOpacity style={styles.tipsCard}>
                    <LinearGradient
                        colors={['#1C1C1E', '#111']}
                        style={styles.tipsGradient}
                    >
                        <View style={styles.tipsText}>
                            <Text style={styles.tipsTitle}>Nutrition Tip for Week {currentWeek}</Text>
                            <Text style={styles.tipsDesc}>Increasing Choline intake helps baby's memory development.</Text>
                        </View>
                        <View style={styles.tipsIcon}>
                            <Info size={24} color="#FFF" />
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
    // Search
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        height: 50,
        borderRadius: 16,
        paddingHorizontal: 16,
        gap: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    searchInput: {
        flex: 1,
        color: '#FFF',
        fontSize: 16,
    },
    // Categories
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    catRow: {
        paddingHorizontal: 20,
        gap: 12,
        paddingBottom: 30,
    },
    catCard: {
        alignItems: 'center',
        gap: 8,
        marginRight: 4,
    },
    catIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    catLabel: {
        color: '#CCC',
        fontSize: 12,
        fontWeight: '500',
    },
    // List
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 20,
    },
    seeAll: {
        color: '#FF4D6D',
        fontWeight: '600',
    },
    list: {
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 30,
    },
    foodItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#222',
        gap: 16,
    },
    foodIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#2A2A2A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    foodInfo: {
        flex: 1,
    },
    foodName: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    foodLimit: {
        color: '#888',
        fontSize: 12,
        marginTop: 2,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        gap: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
    },
    // Tips
    tipsCard: {
        marginHorizontal: 20,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#333',
    },
    tipsGradient: {
        flexDirection: 'row',
        padding: 20,
        gap: 16,
        alignItems: 'center',
    },
    tipsText: {
        flex: 1,
    },
    tipsTitle: {
        color: '#FF4D6D',
        fontWeight: '700',
        marginBottom: 6,
    },
    tipsDesc: {
        color: '#CCC',
        lineHeight: 20,
    },
    tipsIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
