import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

const PregnancyContext = createContext();

export const PregnancyProvider = ({ children }) => {
    // Auth State
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    // Core Data
    const [dueDate, setDueDate] = useState(new Date(new Date().setDate(new Date().getDate() + 196)));
    const [name, setName] = useState("Mom-to-be");
    const [onboardingComplete, setOnboardingComplete] = useState(false);

    // Limits / Targets
    const [waterTarget, setWaterTarget] = useState(2500);
    const [sleepGoal, setSleepGoal] = useState(8);

    // DAILY LOGS STORAGE
    const [logs, setLogs] = useState({});
    const [loading, setLoading] = useState(true);

    // Helper: Get Today's Date Key
    const getTodayKey = () => new Date().toLocaleDateString('en-CA');

    const todayKey = getTodayKey();

    // Auth state listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
                // Reset state on logout
                setOnboardingComplete(false);
                setLogs({});
                setName("Mom-to-be");
                setDueDate(new Date(new Date().setDate(new Date().getDate() + 196)));
                setWaterTarget(2500);
                setSleepGoal(8);
            }
            setAuthLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Fetch user profile and logs on authentication
    useEffect(() => {
        if (isAuthenticated && user) {
            fetchUserProfile();
            fetchLogs();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, user]);

    const fetchUserProfile = async () => {
        try {
            const profileRef = doc(db, 'profiles', user.uid);
            const docSnap = await getDoc(profileRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setName(data.name || "Mom-to-be");
                setDueDate(data.due_date ? new Date(data.due_date) : new Date(new Date().setDate(new Date().getDate() + 196)));
                setWaterTarget(data.water_target || 2500);
                setSleepGoal(data.sleep_goal || 8);
                setOnboardingComplete(data.onboarding_complete || false);

                // Backfill email if missing in profile but available in auth
                if (!data.email && user.email) {
                    await updateDoc(profileRef, { email: user.email }).catch(err => console.log('Error backfilling email:', err));
                }
            } else {
                // First time user - create profile
                await createUserProfile();
            }
        } catch (err) {
            console.log('Error fetching profile:', err);
        }
    };

    const createUserProfile = async () => {
        try {
            await setDoc(doc(db, 'profiles', user.uid), {
                id: user.uid,
                email: user.email,
                name: 'Mom-to-be',
                due_date: new Date(new Date().setDate(new Date().getDate() + 196)).toISOString().split('T')[0],
                water_target: 2500,
                sleep_goal: 8,
                onboarding_complete: false,
                created_at: new Date().toISOString()
            });
        } catch (err) {
            console.log('Error creating profile:', err);
        }
    };

    const fetchLogs = async () => {
        try {
            const logsRef = collection(db, 'daily_logs');
            const q = query(logsRef, where('user_id', '==', user.uid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const loadedLogs = {};
                querySnapshot.forEach((doc) => {
                    const row = doc.data();
                    loadedLogs[row.date] = row.data;
                });
                setLogs(loadedLogs);
            }
        } catch (err) {
            console.log('Error fetching logs:', err);
        } finally {
            setLoading(false);
        }
    };

    // Get current day's data or defaults (Safe access)
    const logEntry = logs[todayKey] || {};
    const currentLog = {
        weight: typeof logEntry.weight === 'number' ? logEntry.weight : 64.5,
        water: logEntry.water ?? 0,
        sleep: logEntry.sleep ?? { hours: 0, minutes: 0, quality: 'Neutral' },
        kicks: logEntry.kicks ?? 0,
        mood: logEntry.mood ?? null
    };

    // Save name to Supabase user metadata -> changed to Firebase target
    const updateNameInFirebase = async (newName) => {
        try {
            if (user) {
                const profileRef = doc(db, 'profiles', user.uid);
                await updateDoc(profileRef, { name: newName });
            }
        } catch (err) {
            console.error('Error updating name:', err);
        }
    };

    const handleSetName = (newName) => {
        setName(newName);
        updateNameInFirebase(newName);
    };

    const handleSetDueDate = async (newDate) => {
        setDueDate(newDate);
        if (user) {
            try {
                const profileRef = doc(db, 'profiles', user.uid);
                await updateDoc(profileRef, { due_date: newDate.toISOString().split('T')[0] });
            } catch (err) {
                console.error('Error updating due date:', err);
            }
        }
    };

    const handleSetWaterTarget = async (newTarget) => {
        setWaterTarget(newTarget);
        if (user) {
            try {
                const profileRef = doc(db, 'profiles', user.uid);
                await updateDoc(profileRef, { water_target: newTarget });
            } catch (err) {
                console.error('Error updating water target:', err);
            }
        }
    };

    const handleSetSleepGoal = async (newGoal) => {
        setSleepGoal(newGoal);
        if (user) {
            try {
                const profileRef = doc(db, 'profiles', user.uid);
                await updateDoc(profileRef, { sleep_goal: newGoal });
            } catch (err) {
                console.error('Error updating sleep goal:', err);
            }
        }
    };

    const handleSetOnboardingComplete = async (value) => {
        setOnboardingComplete(value);
        if (user) {
            try {
                const profileRef = doc(db, 'profiles', user.uid);
                await updateDoc(profileRef, { onboarding_complete: value });
            } catch (err) {
                console.error('Error updating onboarding status:', err);
            }
        }
    };

    const setWeight = (val) => updateLog('weight', val);
    const setWater = (val) => updateLog('water', val);
    const setSleep = (val) => updateLog('sleep', val);
    const setKickCount = (val) => {
        const newVal = typeof val === 'function' ? val(currentLog.kicks) : val;
        updateLog('kicks', newVal);
    };

    const updateLog = (key, value) => {
        setLogs(prev => {
            const prevDayLog = prev[todayKey] || {
                weight: 64.5,
                water: 0,
                sleep: { hours: 0, minutes: 0, quality: 'Neutral' },
                kicks: 0,
                mood: null
            };

            const newDayLog = {
                ...prevDayLog,
                [key]: value
            };

            // Sync to Firebase
            if (user) {
                try {
                    const logRef = doc(db, 'daily_logs', `${user.uid}_${todayKey}`);
                    setDoc(logRef, {
                        user_id: user.uid,
                        date: todayKey,
                        data: newDayLog
                    }, { merge: true }).catch(err => {
                        console.error("Firebase Sync Error:", err.message);
                    });
                } catch (e) { }
            }

            return {
                ...prev,
                [todayKey]: newDayLog
            };
        });
    };

    const calculatePregnancyStats = () => {
        if (!dueDate) return null;
        const today = new Date();
        const due = new Date(dueDate);
        const totalDuration = 280;
        const diffTime = due - today;
        const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        const daysElapsed = totalDuration - daysRemaining;
        const currentWeek = Math.floor(daysElapsed / 7) + 1;
        const currentDayOfWeek = (daysElapsed % 7) + 1;

        let trimester = 1;
        if (currentWeek > 13) trimester = 2;
        if (currentWeek > 27) trimester = 3;

        const progress = Math.min(Math.max(daysElapsed / totalDuration, 0), 1);

        return { daysRemaining, currentWeek, currentDayOfWeek, trimester, progress, progressPercent: Math.round(progress * 100) };
    };

    const stats = calculatePregnancyStats();

    // DYNAMIC HISTORY CALCULATION
    const getHistory = () => {
        if (!stats) return [];

        // Group logs by pregnancy week
        const historyMap = {};

        Object.keys(logs).forEach(dateKey => {
            const entry = logs[dateKey];
            const entryDate = new Date(dateKey);

            // Calculate week for this specific entry date
            const due = new Date(dueDate);
            const diffTime = due - entryDate;
            const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const daysElapsed = 280 - daysRemaining;
            const week = Math.floor(daysElapsed / 7) + 1;

            if (!historyMap[week]) {
                historyMap[week] = {
                    dateStart: entryDate,
                    dateEnd: entryDate,
                    weights: [],
                    water: [],
                    sleep: [],
                    kicks: 0,
                    moods: []
                };
            }

            const weekData = historyMap[week];
            if (entryDate < weekData.dateStart) weekData.dateStart = entryDate;
            if (entryDate > weekData.dateEnd) weekData.dateEnd = entryDate;

            if (entry.weight) weekData.weights.push(entry.weight);
            if (entry.water) weekData.water.push(entry.water);
            if (entry.sleep?.hours) weekData.sleep.push(entry.sleep.hours + (entry.sleep.minutes / 60));
            if (entry.kicks) weekData.kicks += entry.kicks;
            if (entry.mood) weekData.moods.push(entry.mood);
        });

        // Format for UI
        return Object.keys(historyMap).sort((a, b) => b - a).map(week => {
            const data = historyMap[week];

            const avgWeight = data.weights.length ? (data.weights.reduce((a, b) => a + b, 0) / data.weights.length).toFixed(1) : '-';
            const avgWater = data.water.length ? Math.round(data.water.reduce((a, b) => a + b, 0) / data.water.length) : '-';
            const avgSleepRaw = data.sleep.length ? (data.sleep.reduce((a, b) => a + b, 0) / data.sleep.length) : 0;
            const avgSleep = avgSleepRaw ? `${Math.floor(avgSleepRaw)}h ${Math.round((avgSleepRaw % 1) * 60)}m` : '-';

            const moodCounts = data.moods.reduce((acc, curr) => { acc[curr] = (acc[curr] || 0) + 1; return acc; }, {});
            const topMood = Object.keys(moodCounts).sort((a, b) => moodCounts[b] - moodCounts[a])[0] || '-';

            return {
                week: week,
                startDate: data.dateStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                endDate: data.dateEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                avgWeight: avgWeight !== '-' ? `${avgWeight}kg` : '-',
                avgWater: avgWater !== '-' ? `${avgWater}ml` : '-',
                avgSleep: avgSleep,
                totalKicks: data.kicks,
                mood: topMood
            };
        });
    };

    const history = getHistory();

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error('Error during logout:', err);
        }
    };

    return (
        <PregnancyContext.Provider value={{
            user, isAuthenticated, authLoading, logout,
            dueDate, setDueDate: handleSetDueDate,
            name, setName: handleSetName,
            onboardingComplete, setOnboardingComplete: handleSetOnboardingComplete,
            stats,
            weight: currentLog.weight, setWeight,
            water: currentLog.water, setWater, waterTarget, setWaterTarget: handleSetWaterTarget,
            sleep: currentLog.sleep, setSleep, sleepGoal, setSleepGoal: handleSetSleepGoal,
            kickCount: currentLog.kicks, setKickCount,
            history: history,
            logs,
            updateLog
        }}>
            {children}
        </PregnancyContext.Provider>
    );
};

export const usePregnancy = () => useContext(PregnancyContext);
