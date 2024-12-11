import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { categoriesService } from '../api/categoriesService';
import { Category } from '../api/types';

const CategoryManagementScreen = ({ navigation, route }) => {
    const { initialType } = route.params || {};
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeTab, setActiveTab] = useState<'expense' | 'income'>(
        initialType === 'income' ? 'income' : 'expense'
    );

    useEffect(() => {
        loadCategories();
    }, [activeTab]);

    const loadCategories = async () => {
        try {
            const fetchedCategories = await categoriesService.getAll(activeTab);
            setCategories(fetchedCategories);
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    };

    const handleAddCategory = () => {
        // Navigate to category creation screen
        navigation.navigate('CreateCategory', {
            type: activeTab,
            onCategoryCreated: loadCategories
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit categories</Text>
                <TouchableOpacity onPress={handleAddCategory}>
                    <MaterialCommunityIcons name="plus" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === 'expense' && styles.activeTab
                    ]}
                    onPress={() => setActiveTab('expense')}
                >
                    <Text style={[
                        styles.tabText,
                        activeTab === 'expense' && styles.activeTabText
                    ]}>Expense</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === 'income' && styles.activeTab
                    ]}
                    onPress={() => setActiveTab('income')}
                >
                    <Text style={[
                        styles.tabText,
                        activeTab === 'income' && styles.activeTabText
                    ]}>Income</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.categoryList}>
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={styles.categoryItem}
                        onPress={() => navigation.navigate('EditCategory', {
                            category,
                            onCategoryUpdated: loadCategories
                        })}
                    >
                        <View style={styles.categoryLeft}>
                            <MaterialCommunityIcons
                                name={category.icon}
                                size={24}
                                color={category.color}
                            />
                            <Text style={styles.categoryName}>{category.name}</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
                    </TouchableOpacity>
                ))}
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
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#FF5722',
    },
    tabText: {
        fontSize: 16,
        color: '#666',
    },
    activeTabText: {
        color: '#FF5722',
        fontWeight: '600',
    },
    categoryList: {
        flex: 1,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    categoryLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    categoryName: {
        fontSize: 16,
        marginLeft: 12,
    },
});

export default CategoryManagementScreen;
