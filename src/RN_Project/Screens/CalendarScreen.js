import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const today = moment().format('YYYY-MM-DD');

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar View</Text>
      
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#007AFF' },
          [today]: { selected: true, selectedColor: 'green' }
        }}
        theme={{
          todayTextColor: 'red',
          arrowColor: '#007AFF',
        }}
      />

      <Text style={styles.selectedDate}>Selected Date: {selectedDate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  selectedDate: {
    fontSize: 18,
    marginTop: 20,
    color: '#007AFF',
  },
});
