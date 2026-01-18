import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MENU_DATA } from '../data/menuData';
import MenuItem from '../components/MenuItem';

export default function MenuScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <StatusBar barStyle="light-content" />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Sitemap</Text>
                    {/* The screenshot doesn't show a header, but typical Apple apps have one. 
                Sitemap seems appropriate given the content. */}
                </View>

                {MENU_DATA.map((item) => (
                    <MenuItem key={item.id} item={item} />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    scrollContent: {
        paddingTop: 10,
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 20,
        paddingHorizontal: 0,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 34,
        fontWeight: 'bold',
    }
});
