import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Droplet, Moon, Scale, Calendar, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { usePregnancy } from '../../context/PregnancyContext';

const { width, height } = Dimensions.get('window');

const StepIndicator = ({ current, total }) => (
    <View style={styles.stepContainer}>
        {Array.from({ length: total }).map((_, i) => (
            <View
                key={i}
                style={[
                    styles.stepDot,
                    i === current && styles.stepDotActive,
                    i < current && styles.stepDotCompleted
                ]}
            />
        ))}
    </View>
);

export default function OnboardingScreen({ navigation }) {
    const { setDueDate, setWaterTarget, setSleepGoal, setWeight, setOnboardingComplete } = usePregnancy();
    const [step, setStep] = useState(0);

    // Temp State for inputs
    const [weekInput, setWeekInput] = useState(12);
    const [waterInput, setWaterInput] = useState(2500);
    const [sleepInput, setSleepInput] = useState(8);
    const [weightInput, setWeightInput] = useState(65.0);

    const fadeAnim = useRef(new Animated.Value(1)).current;

    const nextStep = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        Animated.sequence([
            Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true })
        ]).start();

        setTimeout(() => {
            if (step < 3) {
                setStep(step + 1);
            } else {
                finishOnboarding();
            }
        }, 200);
    };

    const finishOnboarding = async () => {
        // Save Everything
        const today = new Date();
        const daysGone = weekInput * 7;
        const totalDays = 280;
        const daysRemaining = totalDays - daysGone;
        const due = new Date(today.setDate(today.getDate() + daysRemaining));

        setDueDate(due);
        setWaterTarget(waterInput);
        setSleepGoal(sleepInput);
        setWeight(weightInput);
        setOnboardingComplete(true);
    };

    const renderContent = () => {
        switch (step) {
            case 0: // Week
                return (
                    <View style={styles.content}>
                        <View style={[styles.iconBox, { backgroundColor: '#FF4D6D' }]}>
                            <Calendar size={40} color="#FFF" />
                        </View>
                        <Text style={styles.title}>How far along are you?</Text>
                        <Text style={styles.subtitle}>Roughly which week is it?</Text>

                        <View style={styles.inputContainer}>
                            <TouchableOpacity onPress={() => setWeekInput(Math.max(1, weekInput - 1))} style={styles.adjustBtn}>
                                <Text style={styles.adjustText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.valueText}>{weekInput} <Text style={styles.unitText}>Weeks</Text></Text>
                            <TouchableOpacity onPress={() => setWeekInput(Math.min(40, weekInput + 1))} style={styles.adjustBtn}>
                                <Text style={styles.adjustText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            case 1: // Water
                return (
                    <View style={styles.content}>
                        <View style={[styles.iconBox, { backgroundColor: '#4CC9F0' }]}>
                            <Droplet size={40} color="#FFF" />
                        </View>
                        <Text style={styles.title}>Stay Hydrated</Text>
                        <Text style={styles.subtitle}>What's your daily water goal?</Text>

                        <View style={styles.inputContainer}>
                            <TouchableOpacity onPress={() => setWaterInput(Math.max(1000, waterInput - 250))} style={styles.adjustBtn}>
                                <Text style={styles.adjustText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.valueText}>{waterInput} <Text style={styles.unitText}>ml</Text></Text>
                            <TouchableOpacity onPress={() => setWaterInput(waterInput + 250)} style={styles.adjustBtn}>
                                <Text style={styles.adjustText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            case 2: // Sleep
                return (
                    <View style={styles.content}>
                        <View style={[styles.iconBox, { backgroundColor: '#A9DEF9' }]}>
                            <Moon size={40} color="#FFF" />
                        </View>
                        <Text style={styles.title}>Rest Well</Text>
                        <Text style={styles.subtitle}>How many hours of sleep do you aim for?</Text>

                        <View style={styles.inputContainer}>
                            <TouchableOpacity onPress={() => setSleepInput(Math.max(4, sleepInput - 1))} style={styles.adjustBtn}>
                                <Text style={styles.adjustText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.valueText}>{sleepInput} <Text style={styles.unitText}>Hours</Text></Text>
                            <TouchableOpacity onPress={() => setSleepInput(Math.min(12, sleepInput + 1))} style={styles.adjustBtn}>
                                <Text style={styles.adjustText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            case 3: // Weight
                return (
                    <View style={styles.content}>
                        <View style={[styles.iconBox, { backgroundColor: '#E4C1F9' }]}>
                            <Scale size={40} color="#FFF" />
                        </View>
                        <Text style={styles.title}>Track Progress</Text>
                        <Text style={styles.subtitle}>What is your current weight?</Text>

                        <View style={styles.inputContainer}>
                            <TouchableOpacity onPress={() => setWeightInput(Math.round((weightInput - 0.5) * 10) / 10)} style={styles.adjustBtn}>
                                <Text style={styles.adjustText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.valueText}>{weightInput.toFixed(1)} <Text style={styles.unitText}>kg</Text></Text>
                            <TouchableOpacity onPress={() => setWeightInput(Math.round((weightInput + 0.5) * 10) / 10)} style={styles.adjustBtn}>
                                <Text style={styles.adjustText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#000', '#1C1C1E']}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.header}>
                <StepIndicator current={step} total={4} />
            </View>

            <Animated.View style={[styles.main, { opacity: fadeAnim }]}>
                {renderContent()}
            </Animated.View>

            <View style={styles.footer}>
                <TouchableOpacity onPress={nextStep} style={styles.nextBtn}>
                    <LinearGradient
                        colors={['#FF4D6D', '#FF8FAB']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={styles.gradientBtn}
                    >
                        <Text style={styles.nextText}>{step === 3 ? "Let's Start" : "Next"}</Text>
                        {step === 3 ? <Check size={20} color="#FFF" /> : <ChevronRight size={20} color="#FFF" />}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        paddingTop: 20,
        alignItems: 'center',
    },
    stepContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    stepDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#333',
    },
    stepDotActive: {
        backgroundColor: '#FF4D6D',
        width: 24,
    },
    stepDotCompleted: {
        backgroundColor: '#FF4D6D',
    },
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    content: {
        alignItems: 'center',
        width: '100%',
    },
    iconBox: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
        marginBottom: 60,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 30,
    },
    adjustBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    adjustText: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: '300',
    },
    valueText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFF',
        fontVariant: ['tabular-nums'],
    },
    unitText: {
        fontSize: 18,
        color: '#666',
        fontWeight: '600',
    },
    footer: {
        padding: 30,
    },
    nextBtn: {
        width: '100%',
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
    },
    gradientBtn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    nextText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
