import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import * as Calendar from 'expo-calendar';
import { useEffect, useState } from 'react';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

export default function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getCalendarEvents().then(setEvents);
  }, []);

  return (
    <View style={styles.container}>
      {events.map((event) => (
        <Text key={event.id}>{event.title}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


async function getCalendarEvents() {
  const { status } = await Calendar.requestCalendarPermissionsAsync();

  if (status === 'granted') {
    // Fetch calendar events
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);

    const events = await Calendar.getEventsAsync(
      calendars.map((calendar) => calendar.id),
      startDate,
      endDate
    );

    // Sort events by start date and time
    events.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    // Return the first three events
    return events.slice(0, 3);
  } else {
    console.log('Calendar permission not granted');
    return [];
  }
}






