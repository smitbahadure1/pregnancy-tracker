export const MENU_DATA = [
    {
        id: '1',
        title: 'Onboarding',
        count: 12,
        children: [
            {
                id: '1.1',
                title: 'Completing account setup',
                count: 34,
                children: [
                    { id: '1.1.1', title: 'Subscribing to Flo premium', count: 10 },
                    { id: '1.1.2', title: 'Creating an account', count: 6 },
                ],
            },
        ],
    },
    {
        id: '2',
        title: 'Today',
        count: 9,
        children: [
            { id: '2.1', title: 'Logging my period', count: 5 },
            {
                id: '2.2',
                title: 'Logging my symptoms',
                count: 17,
                children: [
                    { id: '2.2.1', title: 'Water intake settings', count: 7 },
                    { id: '2.2.2', title: 'Weight chart', count: 2 },
                    { id: '2.2.3', title: 'Basal temperature chart', count: 2 },
                ],
            },
            { id: '2.3', title: 'Daily insights', count: 8 },
            {
                id: '2.4',
                title: 'Editing period dates',
                count: 8,
                children: [
                    { id: '2.4.1', title: 'Switching to yearly view', count: 2 },
                    { id: '2.4.2', title: 'Editing categories', count: 11 },
                ],
            },
        ],
    },
    {
        id: '3',
        title: 'Insights',
        count: 10,
        children: [
            { id: '3.1', title: 'Topic detail', count: 6 },
            { id: '3.2', title: 'Video course', count: 8 },
            { id: '3.3', title: 'Bookmarks', count: 2 },
            { id: '3.4', title: 'Notifications', count: 4 },
        ],
    },
    {
        id: '4',
        title: 'Secret chats',
        count: 6,
        children: [
            {
                id: '4.1',
                title: 'Following a topic',
                count: 3,
                children: [
                    { id: '4.1.1', title: 'Commenting on a post', count: 6 },
                ]
            },
            {
                id: '4.2',
                title: 'Searching a chat',
                count: 7,
                children: [
                    { id: '4.2.1', title: 'Saving a chat', count: 3 },
                    { id: '4.2.2', title: 'Liking a comment', count: 2 },
                ]
            },
            { id: '4.3', title: 'Reporting a comment', count: 5 },
            { id: '4.4', title: 'Managing my interests', count: 9 },
            { id: '4.5', title: 'Hiding a topic', count: 4 },
        ]
    },
    {
        id: '5',
        title: 'Messages',
        count: 3,
        children: [
            { id: '5.1', title: 'Chatting with Flo health assistant', count: 13 },
            { id: '5.2', title: 'Start a new chat', count: 5 },
        ]
    },
    {
        id: '6',
        title: 'Partner',
        count: 8,
        children: [
            { id: '6.1', title: 'Linking a partner', count: 10 },
            { id: '6.2', title: 'Stop sharing with a partner', count: 6 },
        ]
    },
    {
        id: '7',
        title: 'Settings',
        count: 3,
        startExpanded: true,
        children: [
            { id: '7.1', title: 'Editing my profile', count: 8 },
            { id: '7.2', title: 'Logging out', count: 3 },
            { id: '7.3', title: 'Lifestyle settings', count: 2 },
            { id: '7.4', title: 'Deleting my account', count: 5 },
            { id: '7.5', title: 'Switching to get pregnant mode', count: 6 },
            { id: '7.6', title: 'Switching to track pregnancy mode', count: 17 },
            { id: '7.7', title: 'Report', count: 4 },
            { id: '7.8', title: 'Graphs & reports', count: 6 },
            { id: '7.9', title: 'Cycle and ovulation', count: 3 },
            {
                id: '7.10',
                title: 'Switching to dark mode',
                count: 10,
                children: [
                    { id: '7.10.1', title: 'Connecting to Health app', count: 3 },
                    { id: '7.10.2', title: 'Change language', count: 3 },
                ]
            },
            { id: '7.11', title: 'Access code', count: 5 },
            { id: '7.12', title: 'Reminders', count: 3 },
            { id: '7.13', title: 'Help', count: 5 },
            {
                id: '7.14',
                title: 'About Flo',
                count: 4,
                children: [
                    { id: '7.14.1', title: 'Privacy & security', count: 4 },
                ]
            },
            { id: '7.15', title: 'Privacy policy', count: 2 },
            { id: '7.16', title: 'Terms of use', count: 2 },
        ]
    },
    {
        id: '8',
        title: 'Logging in',
        count: 8
    }
];
