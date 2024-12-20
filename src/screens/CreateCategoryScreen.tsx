import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    SafeAreaView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { categoriesService } from '../api/categoriesService';

const availableIcons = [
    'food', 'shopping-outline', 'tshirt-crew-outline', 'lipstick',
    'currency-usd', 'medical-bag', 'school', 'lightning-bolt', 'train'
];

const availableColors = [
    '#FF5722', '#2196F3', '#4CAF50', '#FFC107', '#9C27B0',
    '#FF9800', '#795548', '#607D8B', '#E91E63', '#00BCD4'
];

const CreateCategoryScreen = ({ navigation, route }) => {
    const { type, onCategoryCreated } = route.params;
    const [name, setName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState(availableIcons[0]);
    const [selectedColor, setSelectedColor] = useState(availableColors[0]);

    const handleCreate = async () => {
        try {
            if (!name.trim()) {
                Alert.alert('Error', 'Please enter a category name');
                return;
            }

            const categoryData = {
                name: name.trim(),
                type,
                icon: selectedIcon,
                color: selectedColor,
            };

            await categoriesService.create(categoryData);
            onCategoryCreated?.();
            navigation.goBack();
        } catch (error) {
            console.error('Failed to create category:', error);
            Alert.alert('Error', 'Failed to create category');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#334155" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Category</Text>
                <TouchableOpacity onPress={handleCreate}>
                    <Text style={styles.saveButton}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter category name"
                        placeholderTextColor="#94A3B8"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Icon</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.iconGrid}>
                            {availableIcons.map((icon) => (
                                <TouchableOpacity
                                    key={icon}
                                    style={[
                                        styles.iconButton,
                                        selectedIcon === icon && styles.selectedIcon
                                    ]}
                                    onPress={() => setSelectedIcon(icon)}
                                >
                                    <MaterialCommunityIcons
                                        name={icon}
                                        size={24}
                                        color={selectedIcon === icon ? '#FFFFFF' : '#64748B'}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Color</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.colorGrid}>
                            {availableColors.map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    style={[
                                        styles.colorButton,
                                        { backgroundColor: color },
                                        selectedColor === color && styles.selectedColor
                                    ]}
                                    onPress={() => setSelectedColor(color)}
                                />
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#334155',
        letterSpacing: 0.2,
    },
    saveButton: {
        color: '#4CAF50',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    inputContainer: {
        marginBottom: 28,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 12,
        color: '#64748B',
        letterSpacing: 0.3,
    },
    input: {
        borderWidth: 1,
        borderColor: '#F0F0F0',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#334155',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    section: {
        marginBottom: 28,
    },
    iconGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        paddingVertical: 4,
    },
    iconButton: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    selectedIcon: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        paddingVertical: 4,
    },
    colorButton: {
        width: 52,
        height: 52,
        borderRadius: 16,
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedColor: {
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
});

export default CreateCategoryScreen;
