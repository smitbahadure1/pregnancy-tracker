import { Heart, Baby, Calendar, Check, Stethoscope, Music, Video, User, Gift, Home } from 'lucide-react-native';

export const MILESTONES = [
    // Trimester 1
    { week: 4, title: 'Positive Test', description: 'The journey begins! Your tiny miracle is starting to grow.', icon: Heart, trimester: 1 },
    { week: 6, title: 'First Heartbeat', description: 'A tiny flutter can often be detected via ultrasound.', icon: Stethoscope, trimester: 1 },
    { week: 8, title: 'First Ultrasound', description: 'Meeting your baby for the first time.', icon: Video, trimester: 1 },
    { week: 10, title: 'Tiny Fingers', description: 'Fingers and toes are beginning to form.', icon: Baby, trimester: 1 },
    { week: 12, title: 'End of Trimester 1', description: 'The risk of miscarriage drops significantly.', icon: Check, trimester: 1 },

    // Trimester 2
    { week: 14, title: 'Second Trimester', description: 'Welcome to the "Golden Period" of pregnancy.', icon: Calendar, trimester: 2 },
    { week: 16, title: 'Gender Reveal Window', description: 'You might be able to find out if it’s a boy or girl!', icon: User, trimester: 2 },
    { week: 18, title: 'Baby Can Hear', description: 'Your baby can now hear your heartbeat and voice.', icon: Music, trimester: 2 },
    { week: 20, title: 'Anatomy Scan', description: 'Halfway there! A detailed look at baby’s growth.', icon: Video, trimester: 2 },
    { week: 24, title: 'Viability Milestone', description: 'Baby has a chance of survival if born now.', icon: Stethoscope, trimester: 2 },
    { week: 28, title: 'Third Trimester', description: 'The final stretch begins!', icon: Calendar, trimester: 2 }, // Actually start of T3

    // Trimester 3
    { week: 30, title: 'Baby Opens Eyes', description: 'Your baby can now blink and see light.', icon: Baby, trimester: 3 },
    { week: 32, title: 'Baby Shower', description: 'Celebrating the upcoming arrival with loved ones.', icon: Gift, trimester: 3 },
    { week: 36, title: 'Nesting Instinct', description: 'Getting everything ready for the big day.', icon: Home, trimester: 3 },
    { week: 37, title: 'Full Term', description: 'Baby is considered full term and ready to arrive.', icon: Check, trimester: 3 },
    { week: 40, title: 'Due Date', description: 'The grand finale! Meeting your little one.', icon: Heart, trimester: 3 },
];
