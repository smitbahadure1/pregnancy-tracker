import React, { createContext, useState, useContext, useEffect } from 'react';

const PregnancyContext = createContext();

import { supabase } from '../lib/supabase';

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
        // Check current session
        const checkAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    setUser(session.user);
                    setIsAuthenticated(true);
                    // Load name from user metadata
                    const userName = session.user.user_metadata?.name || "Mom-to-be";
                    setName(userName);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (err) {
                console.error('Auth check error:', err);
            } finally {
                setAuthLoading(false);
            }
        };

        checkAuth();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session?.user) {
                    setUser(session.user);
                    setIsAuthenticated(true);
                    // Load name from user metadata
                    const userName = session.user.user_metadata?.name || "Mom-to-be";
                    setName(userName);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }
        );

        return () => {
            subscription?.unsubscribe();
        };
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
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.log('Profile fetch error:', error.message);
                return;
            }

            if (data) {
                setName(data.name || "Mom-to-be");
                setDueDate(data.due_date ? new Date(data.due_date) : new Date(new Date().setDate(new Date().getDate() + 196)));
                setWaterTarget(data.water_target || 2500);
                setSleepGoal(data.sleep_goal || 8);
                setOnboardingComplete(data.onboarding_complete || false);

                // Backfill email if missing in profile but available in auth
                if (!data.email && user && user.email) {
                    supabase.from('profiles').update({ email: user.email }).eq('id', user.id).then(({ error }) => {
                        if (error) console.log('Error backfilling email:', error.message);
                    });
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
            await supabase.from('profiles').insert({
                id: user.id,
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
            const { data, error } = await supabase
                .from('daily_logs')
                .select('date, data')
                .eq('user_id', user.id);

            if (error) {
                console.log('Supabase fetch error (might be table missing):', error.message);
                return;
            }

            if (data) {
                const loadedLogs = data.reduce((acc, row) => {
                    acc[row.date] = row.data;
                    return acc;
                }, {});
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

    // Save name to Supabase user metadata
    const updateNameInSupabase = async (newName) => {
        try {
            if (user) {
                // Update in profiles table
                await supabase
                    .from('profiles')
                    .update({ name: newName })
                    .eq('id', user.id);
            }
        } catch (err) {
            console.error('Error updating name:', err);
        }
    };

    // Override setName to also save to Supabase
    const handleSetName = (newName) => {
        setName(newName);
        updateNameInSupabase(newName);
    };

    // Save due date to Supabase
    const handleSetDueDate = (newDate) => {
        setDueDate(newDate);
        if (user) {
            supabase
                .from('profiles')
                .update({ due_date: newDate.toISOString().split('T')[0] })
                .eq('id', user.id)
                .then(({ error }) => {
                    if (error) console.error('Error updating due date:', error);
                });
        }
    };

    // Save water target to Supabase
    const handleSetWaterTarget = (newTarget) => {
        setWaterTarget(newTarget);
        if (user) {
            supabase
                .from('profiles')
                .update({ water_target: newTarget })
                .eq('id', user.id)
                .then(({ error }) => {
                    if (error) console.error('Error updating water target:', error);
                });
        }
    };

    // Save sleep goal to Supabase
    const handleSetSleepGoal = (newGoal) => {
        setSleepGoal(newGoal);
        if (user) {
            supabase
                .from('profiles')
                .update({ sleep_goal: newGoal })
                .eq('id', user.id)
                .then(({ error }) => {
                    if (error) console.error('Error updating sleep goal:', error);
                });
        }
    };

    // Save onboarding complete status to Supabase
    const handleSetOnboardingComplete = (value) => {
        setOnboardingComplete(value);
        if (user) {
            supabase
                .from('profiles')
                .update({ onboarding_complete: value })
                .eq('id', user.id)
                .then(({ error }) => {
                    if (error) console.error('Error updating onboarding status:', error);
                });
        }
    };

    // Setters that update the LOGS for today
    const setWeight = (val) => updateLog('weight', val);
    const setWater = (val) => updateLog('water', val);
    const setSleep = (val) => updateLog('sleep', val);
    const setKickCount = (val) => {
        // Handle explicit value or function update
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

            // Sync to Supabase
            if (user) {
                supabase.from('daily_logs').upsert({
                    user_id: user.id,
                    date: todayKey,
                    data: newDayLog
                }, { onConflict: 'user_id, date' }).then(({ error }) => {
                    if (error) console.error("Supabase Sync Error:", error.message);
                });
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

        // precise calculation requires looping through logs
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
            // Update min/max dates for the week range
            if (entryDate < weekData.dateStart) weekData.dateStart = entryDate;
            if (entryDate > weekData.dateEnd) weekData.dateEnd = entryDate;

            // Push data
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

            // Most frequent mood
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
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Logout error:', error);
            }
        } catch (err) {
            console.error('Error during logout:', err);
        }
    };

    return (
        <PregnancyContext.Provider value={{
            // Auth
            user, isAuthenticated, authLoading, logout,
            // Pregnancy tracking
            dueDate, setDueDate: handleSetDueDate,
            name, setName: handleSetName,
            onboardingComplete, setOnboardingComplete: handleSetOnboardingComplete,
            stats,
            // Expose properties from CURRENT DAY log
            weight: currentLog.weight, setWeight,
            water: currentLog.water, setWater, waterTarget, setWaterTarget: handleSetWaterTarget,
            sleep: currentLog.sleep, setSleep, sleepGoal, setSleepGoal: handleSetSleepGoal,
            kickCount: currentLog.kicks, setKickCount,
            history: history, // Dynamic history
            logs, // Expose raw logs if needed
            updateLog // Expose generic update if needed
        }}>
            {children}
        </PregnancyContext.Provider>
    );
};

export const usePregnancy = () => useContext(PregnancyContext);
