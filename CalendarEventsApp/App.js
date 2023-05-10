import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Linking, Platform } from 'react-native';
import * as Calendar from 'expo-calendar';

export default function App() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    getCalendarEvents().then(setEvents);
  }, []);

  return (
    <View style={styles.container}>
      {selectedEvent ? (
        <EventDetails event={selectedEvent} onBack={() => setSelectedEvent(null)} />
      ) : (
        events.map((event) => (
          <Button key={event.id} title={event.title} onPress={() => setSelectedEvent(event)} />
        ))
      )}
    </View>
  );
}

function EventDetails({ event, onBack }) {
  const openCalendarApp = () => {
    const url = Platform.OS === 'ios' ? 'calshow://' : 'content://com.android.calendar/time/';
    Linking.openURL(url);
  };

  return (
    <View>
      <Text>Title: {event.title}</Text>
      <Text>Start: {new Date(event.startDate).toLocaleString()}</Text>
      <Text>End: {new Date(event.endDate).toLocaleString()}</Text>
      <Text>Location: {event.location || 'N/A'}</Text>
      <Button title="Go back" onPress={onBack} />
      <Button title="Open Calendar App" onPress={openCalendarApp} />
    </View>
  );
}

async function getCalendarEvents() {
  const { status } = await Calendar.requestCalendarPermissionsAsync();

  if (status === 'granted') {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);

    const events = await Calendar.getEventsAsync(
      calendars.map((calendar) => calendar.id),
      startDate,
      endDate
    );

    events.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    return events.slice(0, 3);
  } else {
    console.log('Calendar permission not granted');
    return [];
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});



