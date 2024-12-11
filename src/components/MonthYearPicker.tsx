import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { format, subMonths, addMonths } from 'date-fns';

interface MonthYearPickerProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
}

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({ selectedDate, onDateChange }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handlePreviousMonth = () => {
        onDateChange(subMonths(selectedDate, 1));
    };

    const handleNextMonth = () => {
        onDateChange(addMonths(selectedDate, 1));
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const years = Array.from({ length: 5 }, (_, i) => selectedDate.getFullYear() - 2 + i);

    const handleMonthSelect = (monthIndex: number) => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(monthIndex);
        onDateChange(newDate);
        setModalVisible(false);
    };

    const handleYearSelect = (year: number) => {
        const newDate = new Date(selectedDate);
        newDate.setFullYear(year);
        onDateChange(newDate);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.pickerContainer}>
                <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={handlePreviousMonth}
                >
                    <MaterialIcons name="chevron-left" size={28} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.dateText}>
                        {format(selectedDate, 'MMMM yyyy')}
                    </Text>
                    <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={handleNextMonth}
                >
                    <MaterialIcons name="chevron-right" size={28} color="#666" />
                </TouchableOpacity>
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Month & Year</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <MaterialIcons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.selectionContainer}>
                            <View style={styles.monthsContainer}>
                                <Text style={styles.sectionTitle}>Month</Text>
                                {months.map((month, index) => (
                                    <TouchableOpacity
                                        key={month}
                                        style={[
                                            styles.optionButton,
                                            selectedDate.getMonth() === index && styles.selectedOption
                                        ]}
                                        onPress={() => handleMonthSelect(index)}
                                    >
                                        <Text style={[
                                            styles.optionText,
                                            selectedDate.getMonth() === index && styles.selectedOptionText
                                        ]}>
                                            {month}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.yearsContainer}>
                                <Text style={styles.sectionTitle}>Year</Text>
                                {years.map(year => (
                                    <TouchableOpacity
                                        key={year}
                                        style={[
                                            styles.optionButton,
                                            selectedDate.getFullYear() === year && styles.selectedOption
                                        ]}
                                        onPress={() => handleYearSelect(year)}
                                    >
                                        <Text style={[
                                            styles.optionText,
                                            selectedDate.getFullYear() === year && styles.selectedOptionText
                                        ]}>
                                            {year}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    arrowButton: {
        padding: 8,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    dateText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginRight: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    selectionContainer: {
        flexDirection: 'row',
    },
    monthsContainer: {
        flex: 2,
        marginRight: 16,
    },
    yearsContainer: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginBottom: 12,
    },
    optionButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    selectedOption: {
        backgroundColor: '#FF5722',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    selectedOptionText: {
        color: '#fff',
        fontWeight: '600',
    },
});

export default MonthYearPicker;
