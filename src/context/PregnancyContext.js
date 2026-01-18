import React, { createContext, useState, useContext, useEffect } from 'react';

const PregnancyContext = createContext();

export const PregnancyProvider = ({ children }) => {
    // Default: User is roughly 12 weeks pregnant for demo purposes
    // In a real flow, this would be set via Onboarding
    const [dueDate, setDueDate] = useState(new Date(new Date().setDate(new Date().getDate() + 196))); // ~28 weeks (196 days) remaining -> Current Week ~12
    const [name, setName] = useState("Mom-to-be");
    const [weight, setWeight] = useState(64.5);
    const [water, setWater] = useState(1250); // ml
    const [waterTarget, setWaterTarget] = useState(2500);
    const [sleep, setSleep] = useState({ hours: 8, minutes: 30, quality: 'Excellent' });
    const [sleepGoal, setSleepGoal] = useState(8);

    const calculatePregnancyStats = () => {
        if (!dueDate) return null;

        const today = new Date();
        const due = new Date(dueDate);
        const totalDuration = 280; // 40 weeks * 7 days

        // Calculate days remaining
        const diffTime = due - today;
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Calculate days elapsed
        const daysElapsed = totalDuration - daysRemaining;

        // Current Week (1-40)
        // e.g. Day 0-6 = Week 1, Day 7-13 = Week 2...
        const currentWeek = Math.floor(daysElapsed / 7) + 1;

        // Day of current week (1-7)
        const currentDayOfWeek = (daysElapsed % 7) + 1;

        // Trimester
        let trimester = 1;
        if (currentWeek > 13) trimester = 2;
        if (currentWeek > 27) trimester = 3;

        // Progress 0-1 (0% to 100%)
        const progress = Math.min(Math.max(daysElapsed / totalDuration, 0), 1);

        return {
            daysRemaining,
            currentWeek,
            currentDayOfWeek,
            trimester,
            progress, // 0 to 1
            progressPercent: Math.round(progress * 100)
        };
    };

    const stats = calculatePregnancyStats();

    return (
        <PregnancyContext.Provider value={{
            dueDate, setDueDate,
            name, setName,
            stats,
            weight, setWeight,
            water, setWater, waterTarget, setWaterTarget,
            sleep, setSleep, sleepGoal, setSleepGoal
        }}>
            {children}
        </PregnancyContext.Provider>
    );
};

export const usePregnancy = () => useContext(PregnancyContext);
