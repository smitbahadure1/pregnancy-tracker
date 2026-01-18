import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MENU_DATA } from '../../data/menuData';
import MenuItem from '../../components/MenuItem';

export default function SettingsScreen() {
    // Find the 'Settings' part of the data (ID 7)
    const settingsData = MENU_DATA.find(item => item.title === 'Settings');

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                {settingsData && settingsData.children ? (
                    settingsData.children.map(item => (
                        <MenuItem key={item.id} item={item} />
                    ))
                ) : (
                    <Text style={styles.emptyText}>No settings available</Text>
                )}
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
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#1A1A1A',
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#FFF',
    },
    content: {
        paddingTop: 20,
        paddingHorizontal: 16,
    },
    emptyText: {
        color: '#666',
        textAlign: 'center',
        marginTop: 50,
    }
});
