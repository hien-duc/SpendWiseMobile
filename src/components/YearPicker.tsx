import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface YearPickerProps {
    selectedYear: number;
    onYearChange: (year: number) => void;
}

const YearPicker: React.FC<YearPickerProps> = ({ selectedYear, onYearChange }) => {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [pressedYear, setPressedYear] = React.useState<number | null>(null);

    const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - i);

    const handleYearSelect = (year: number) => {
        onYearChange(year);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.selectedYearContainer}
                activeOpacity={0.7}
            >
                <MaterialIcons name="calendar-today" size={24} style={styles.icon} />
                <Text style={styles.selectedYear}>{selectedYear}</Text>
            </TouchableOpacity>
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                statusBarTranslucent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity 
                    style={styles.modalContainer} 
                    activeOpacity={1} 
                    onPress={() => setModalVisible(false)}
                >
                    <TouchableOpacity 
                        activeOpacity={1} 
                        onPress={e => e.stopPropagation()}
                        style={styles.modalContent}
                    >
                        <Text style={styles.title}>Select Year</Text>
                        {years.map(year => (
                            <TouchableOpacity
                                key={year}
                                onPress={() => handleYearSelect(year)}
                                onPressIn={() => setPressedYear(year)}
                                onPressOut={() => setPressedYear(null)}
                                style={[
                                    styles.yearOption,
                                    pressedYear === year && styles.yearOptionPressed
                                ]}
                            >
                                <Text style={{
                                    color: year === selectedYear ? '#444444' : '#666666',
                                    fontWeight: year === selectedYear ? '700' : '400'
                                }}>
                                    {year}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={{ marginTop: 15 }}
                        >
                            <Text style={styles.closeButton}>Close</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 0,
        marginBottom: 0,
    },
    selectedYearContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    selectedYear: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333333',
        marginLeft: 10,
    },
    icon: {
        marginRight: 10,
        color: '#666666',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    modalContent: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 15,
        textAlign: 'center',
        color: '#333333',
    },
    yearOption: {
        fontSize: 18,
        paddingVertical: 12,
        textAlign: 'center',
        color: '#444444',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        transition: 'background-color 0.2s',
    },
    yearOptionPressed: {
        backgroundColor: '#F7F7F7',
    },
    closeButton: {
        marginTop: 20,
        color: '#666666',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default YearPicker;
