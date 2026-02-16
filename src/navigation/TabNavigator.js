import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, BookOpen, Map, User, Settings as SettingsIcon, Briefcase, Image, Apple, Activity } from 'lucide-react-native';

import TodayScreen from '../screens/Today/TodayScreen';
import JournalScreen from '../screens/Journal/JournalScreen';
import JourneyScreen from '../screens/Journey/JourneyScreen';
import BodyScreen from '../screens/Body/BodyScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

import * as Haptics from 'expo-haptics';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenListeners={{
                tabPress: () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                },
            }}
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#FF4D6D',
                tabBarInactiveTintColor: '#666',
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600',
                    marginBottom: 4,
                }
            }}
        >
            <Tab.Screen
                name="Today"
                component={TodayScreen}
                options={{
                    tabBarIcon: ({ color }) => <Calendar size={24} color={color} />
                }}
            />
            <Tab.Screen
                name="Journey"
                component={JourneyScreen}
                options={{
                    tabBarIcon: ({ color }) => <Map size={24} color={color} />
                }}
            />
            <Tab.Screen
                name="Journal"
                component={JournalScreen}
                options={{
                    tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />
                }}
            />
            <Tab.Screen
                name="My Body"
                component={BodyScreen}
                options={{
                    tabBarIcon: ({ color }) => <Activity size={24} color={color} />
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color }) => <User size={24} color={color} />
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: '#FFF',
        fontSize: 20
    },
    tabBar: {
        backgroundColor: '#111',
        borderTopColor: '#222',
        borderTopWidth: 1,
        height: 60,
        paddingBottom: 5,
    }
});
