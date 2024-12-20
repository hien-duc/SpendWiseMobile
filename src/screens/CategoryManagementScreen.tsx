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
    const [activeTab, setActiveTab] = useState<'expense' | 'income'>(initialType === 'income' ? 'income' : 'expense');

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
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F4F8',
        backgroundColor: '#FFFFFF',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2E3A59',
        letterSpacing: 0.5,
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F4F8',
        backgroundColor: '#FFFFFF',
        paddingTop: 8,
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    activeTab: {
        borderBottomWidth: 3,
        borderBottomColor: '#4CAF50',
    },
    tabText: {
        fontSize: 18,
        color: '#8F9BB3',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#4CAF50',
        fontWeight: '700',
    },
    categoryList: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: 8,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F4F8',
        backgroundColor: '#FFFFFF',
    },
    categoryLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    categoryName: {
        fontSize: 18,
        color: '#2E3A59',
        fontWeight: '500',
        marginLeft: 16,
    },
});

export default CategoryManagementScreen;
