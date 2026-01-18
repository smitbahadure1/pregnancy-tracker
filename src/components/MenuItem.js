import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const MenuItem = ({ item, level = 0 }) => {
    const [collapsed, setCollapsed] = useState(item.startExpanded ? false : true); // Default collapsed unless specified

    const toggle = () => {
        // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setCollapsed(!collapsed);
    };

    return (
        <View style={styles.itemWrapper}>
            <TouchableOpacity
                style={[styles.row, { paddingLeft: level * 20 }]}
                onPress={toggle}
                activeOpacity={0.7}
            >
                <Text style={[styles.text, level === 0 ? styles.rootText : styles.childText]}>
                    {item.title}
                </Text>
                <View style={styles.filler} />
                <Text style={styles.countText}>{item.count}</Text>
            </TouchableOpacity>

            {item.children && !collapsed && (
                <View style={[
                    styles.childrenBlock,
                    { marginLeft: (level * 20) + 10 }
                ]}>
                    {/* The vertical line guide */}
                    <View style={styles.leftBorder} />

                    {item.children.map((child) => (
                        <View key={child.id} style={styles.childRowWrapper}>
                            {/* Horizontal Tick */}
                            <View style={styles.horizontalTick} />

                            <MenuItem
                                item={child}
                                level={0} // Reset level 
                            />
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

export default MenuItem;

const styles = StyleSheet.create({
    itemWrapper: {
        marginBottom: 0,
        backgroundColor: '#000', // Ensure background merges
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingRight: 16,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 17,
        letterSpacing: -0.2, // Tighter Apple-like tracking
    },
    rootText: {
        fontWeight: '700',
        fontSize: 19,
    },
    childText: {
        fontWeight: '500', // Semi-bold for children too, as per screenshot
        color: '#DDDDDD',
        fontSize: 17,
    },
    filler: {
        flex: 1,
    },
    countText: {
        color: '#666666',
        fontSize: 17,
        fontWeight: '500',
    },
    childrenBlock: {
        borderLeftWidth: 0,
        paddingLeft: 0,
        marginLeft: 10,
    },
    horizontalTick: {
        position: 'absolute',
        left: -10, // Adjust to connect to the vertical line
        top: 23,
        width: 25,
        height: 1,
        backgroundColor: '#333333',
        zIndex: -1,
    },
    childRowWrapper: {
        position: 'relative',
        paddingLeft: 20, // Push child content right
    },
    leftBorder: {
        position: 'absolute',
        left: 10, // Must align with the parent's childrenBlock margin
        top: -10, // Connect from above
        bottom: 0,
        width: 1,
        backgroundColor: '#333333',
    }
});
