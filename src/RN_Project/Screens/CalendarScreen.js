import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import moment from 'moment';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [markedDates, setMarkedDates] = useState({});
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const today = moment().format('YYYY-MM-DD');
  const [eventsByDate, setEventsByDate] = useState({}); // Store events grouped by date

  // Fetch stock-related events
  const fetchEarningsDates = async () => {
    try {
      const response = await axios.get(
        `https://finnhub.io/api/v1/calendar/earnings?from=2024-11-01&to=2024-12-31&token=csnk059r01qqapaib950csnk059r01qqapaib95g`
      );
      const data = response.data.earningsCalendar;

      // Organize events by date for quick lookup
      const events = {};
      const marked = {};
      data.forEach((item) => {
        const date = item.date;
        if (!events[date]) {
          events[date] = [];
        }
        events[date].push(item);
        marked[date] = { marked: true, dotColor: 'red' };
      });

      setEventsByDate(events); // Save grouped events
      setMarkedDates(marked);  // Save marked dates
    } catch (error) {
      console.error('Error fetching earnings dates:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchEarningsDates();
  }, []);

  // Handle date selection
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);

    // Fetch details for the selected date
    if (eventsByDate[day.dateString]) {
      const events = eventsByDate[day.dateString];
      const details = events.map(
        (event) =>
          `Company: ${event.symbol}\nExpected EPS: ${event.epsEstimate}\nTime: ${event.time || 'N/A'}`
      );
      setEventDetails(details.join('\n\n')); // Display multiple events if available
    } else {
      setEventDetails('No stock events available for this date.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stock Events Calendar</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={{
              ...markedDates,
              [selectedDate]: { selected: true, selectedColor: '#007AFF' },
              [today]: { selected: true, selectedColor: 'green' },
            }}
            theme={{
              todayTextColor: 'red',
              arrowColor: '#007AFF',
            }}
          />

          <Text style={styles.selectedDate}>Selected Date: {selectedDate}</Text>
          {eventDetails && (
            <Text style={styles.eventDetails}>{eventDetails}</Text>
          )}
        </>
      )}
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
  eventDetails: {
    fontSize: 16,
    marginTop: 10,
    color: 'red',
    textAlign: 'center',
  },
});
