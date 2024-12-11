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
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
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
                                        color={selectedIcon === icon ? '#fff' : '#000'}
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
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    saveButton: {
        color: '#007AFF',
        fontSize: 17,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    inputContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    section: {
        marginBottom: 24,
    },
    iconGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    iconButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    selectedIcon: {
        backgroundColor: '#007AFF',
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    colorButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedColor: {
        borderColor: '#000',
    },
});

export default CreateCategoryScreen;
