export const INSIGHTS_DATA = {
    // Content keyed by Trimester or General, but we can filter by week ranges
    articles: [
        {
            id: '1',
            title: 'Your Changing Body',
            category: 'Health',
            readTime: '4 min',
            color: '#FF4D6D', // Pink
            type: 'article',
            minWeek: 1,
            maxWeek: 42,
            content: 'Hormonal changes are ramping up! You might feel...'
        },
        {
            id: '2',
            title: 'Foods to Avoid',
            category: 'Nutrition',
            readTime: '6 min',
            color: '#FFD93D', // Yellow
            type: 'article',
            minWeek: 1,
            maxWeek: 42,
            content: 'Sushi and soft cheeses are off the menu for now...'
        },
        {
            id: '3',
            title: 'Morning Sickness Survival Guide',
            category: 'Wellness',
            readTime: '5 min',
            color: '#4CC9F0', // Blue
            type: 'article',
            minWeek: 4,
            maxWeek: 16,
            content: 'Ginger, saltines, and small meals can be your best friends.'
        },
        {
            id: '4',
            title: 'Understanding Ultrasounds',
            category: 'Medical',
            readTime: '8 min',
            color: '#7209B7', // Purple
            type: 'video',
            minWeek: 6,
            maxWeek: 20,
            content: 'What do those black and white blobs actually mean?'
        },
        {
            id: '5',
            title: 'Nesting: It is Real!',
            category: 'Lifestyle',
            readTime: '3 min',
            color: '#FF8FAB',
            type: 'article',
            minWeek: 28,
            maxWeek: 40,
            content: 'Why you suddenly want to clean the entire house.'
        },
        {
            id: '6',
            title: 'Hospital Bag Essentials',
            category: 'Preparation',
            readTime: '10 min',
            color: '#4361EE',
            type: 'checklist',
            minWeek: 30,
            maxWeek: 40,
            content: 'Don’t forget your phone charger!'
        }
    ],

    dailyTips: [
        "Drink at least 8 glasses of water today!",
        "Take your prenatal vitamins with a meal to avoid nausea.",
        "Sleep on your left side to improve blood flow to the baby.",
        "Put your feet up! Swelling is common but rest helps.",
        "Moisturize your belly to help with itching and stretch marks.",
        "Listen to your body—if you need a nap, take one.",
        "Snack on almonds or walnuts for a healthy brain boost.",
        "Practice deep breathing for 5 minutes today.",
        "Walk for 20 minutes to keep your energy up.",
        "Connect with your baby: Talk or sing to your bump!"
    ],

    checklists: {
        1: ["Take prenatal vitamins", "Schedule first doctor appointment", "Check insurance coverage"],
        2: ["Research prenatal classes", "Start a baby registry", "Look into maternity leave policies"],
        3: ["Pack hospital bag", "Install car seat", "Wash baby clothes", "Plan meals for postpartum"]
    },

    partnerTips: [
        "Cook a meal so she doesn't have to smell food cooking.",
        "Give a gentle foot massage to reduce swelling.",
        "Read a baby book together before bed.",
        "Go for a gentle walk together.",
        "Ask her how she is feeling—and really listen.",
        "Take over the heavy lifting (literally).",
        "Plan a babymoon or a relaxing weekend at home.",
        "Help with nesting tasks like painting the nursery."
    ],

    babySizes: [
        { week: 4, name: "Poppy Seed", size: "2 mm", weight: "< 1 g", color: "#E74C3C" },
        { week: 8, name: "Raspberry", size: "1.6 cm", weight: "1 g", color: "#C0392B" },
        { week: 12, name: "Plum", size: "5.4 cm", weight: "14 g", color: "#8E44AD" },
        { week: 16, name: "Avocado", size: "11.6 cm", weight: "100 g", color: "#27AE60" },
        { week: 20, name: "Banana", size: "16.4 cm", weight: "300 g", color: "#F1C40F" },
        { week: 24, name: "Corn", size: "30 cm", weight: "600 g", color: "#F39C12" },
        { week: 28, name: "Eggplant", size: "37.6 cm", weight: "1 kg", color: "#8E44AD" },
        { week: 32, name: "Kale", size: "42.4 cm", weight: "1.7 kg", color: "#2ECC71" },
        { week: 36, name: "Papaya", size: "47.4 cm", weight: "2.6 kg", color: "#E67E22" },
        { week: 36, name: "Papaya", size: "47.4 cm", weight: "2.6 kg", color: "#E67E22" },
        { week: 40, name: "Watermelon", size: "51.2 cm", weight: "3.5 kg", color: "#27AE60" },
    ],

    symptoms: {
        1: [
            { name: "Morning Sickness", relief: "Ginger tea, small meals, vitamin B6." },
            { name: "Fatigue", relief: "Prioritize naps and go to bed early." },
            { name: "Tender Breasts", relief: "Wear a supportive, wire-free bra." }
        ],
        2: [
            { name: "Round Ligament Pain", relief: "Gentle stretching and warm baths." },
            { name: "Backache", relief: "Maintain good posture and wear low-heeled shoes." },
            { name: "Leg Cramps", relief: "Stay hydrated and stretch calves before bed." }
        ],
        3: [
            { name: "Heartburn", relief: "Avoid spicy foods and eat smaller meals." },
            { name: "Swelling", relief: "Elevate your feet and reduce salt intake." },
            { name: "Braxton Hicks", relief: "Change positions and drink water." }
        ]
    }
};
