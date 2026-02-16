import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import TabNavigator from './TabNavigator';
import BreathingScreen from '../screens/Tools/BreathingScreen';
import KickCounterScreen from '../screens/Tools/KickCounterScreen';
import WeightEntryScreen from '../screens/Tools/WeightEntryScreen';
import WaterEntryScreen from '../screens/Tools/WaterEntryScreen';
import SleepEntryScreen from '../screens/Tools/SleepEntryScreen';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import AuthScreen from '../screens/Auth/AuthScreen';
import AdminScreen from '../screens/Admin/AdminScreen';
import { usePregnancy } from '../context/PregnancyContext';

const Stack = createStackNavigator();

export default function RootNavigator() {
    const { isAuthenticated, authLoading, onboardingComplete, user } = usePregnancy();

    if (authLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
                <ActivityIndicator size="large" color="#ff6b9d" />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!isAuthenticated ? (
                <Stack.Screen
                    name="Auth"
                    component={AuthScreen}
                    options={{ animationEnabled: false }}
                />
            ) : !onboardingComplete ? (
                <Stack.Screen
                    name="Onboarding"
                    component={OnboardingScreen}
                    options={{ animationEnabled: false }}
                />
            ) : (
                <>
                    <Stack.Screen name="MainTabs" component={TabNavigator} />
                    {user?.email === 'priyankachavan2675@gmail.com' && (
                        <Stack.Screen
                            name="Admin"
                            component={AdminScreen}
                            options={{
                                presentation: 'fullScreenModal',
                                animationEnabled: true,
                            }}
                        />
                    )}
                    <Stack.Screen
                        name="Breathing"
                        component={BreathingScreen}
                        options={{
                            presentation: 'fullScreenModal',
                            animationEnabled: true,
                        }}
                    />
                    <Stack.Screen
                        name="KickCounter"
                        component={KickCounterScreen}
                        options={{
                            presentation: 'fullScreenModal',
                            animationEnabled: true,
                        }}
                    />
                    <Stack.Screen
                        name="WeightEntry"
                        component={WeightEntryScreen}
                        options={{
                            presentation: 'transparentModal',
                            animationEnabled: true,
                            cardOverlayEnabled: true,
                        }}
                    />
                    <Stack.Screen
                        name="WaterEntry"
                        component={WaterEntryScreen}
                        options={{
                            presentation: 'transparentModal',
                            animationEnabled: true,
                            cardOverlayEnabled: true,
                        }}
                    />
                    <Stack.Screen
                        name="SleepEntry"
                        component={SleepEntryScreen}
                        options={{
                            presentation: 'transparentModal',
                            animationEnabled: true,
                            cardOverlayEnabled: true,
                        }}
                    />
                </>
            )}
        </Stack.Navigator>
    );
}
