import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface YearPickerProps {
    selectedYear: number;
    onYearChange: (year: number) => void;
}

const YearPicker: React.FC<YearPickerProps> = ({ selectedYear, onYearChange }) => {
    const [modalVisible, setModalVisible] = React.useState(false);

    const years = Array.from({ length: selectedYear - (selectedYear - 10) + 1 }, (_, i) => selectedYear - 10 + i);

    const handleYearSelect = (year: number) => {
        onYearChange(year);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.selectedYearContainer}>
                <MaterialIcons name="calendar-today" size={24} color="white" style={styles.icon} />
                <Text style={styles.selectedYear}>{selectedYear}</Text>
            </TouchableOpacity>
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>Select Year</Text>
                        {years.map(year => (
                            <TouchableOpacity key={year} onPress={() => handleYearSelect(year)}>
                                <Text style={styles.yearOption}>{year}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButton}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    selectedYearContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#2196F3',
        borderRadius: 5,
    },
    selectedYear: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 8,
    },
    icon: {
        marginRight: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    yearOption: {
        fontSize: 18,
        paddingVertical: 10,
        textAlign: 'center',
    },
    closeButton: {
        marginTop: 20,
        color: 'blue',
        textAlign: 'center',
    },
});

export default YearPicker;
