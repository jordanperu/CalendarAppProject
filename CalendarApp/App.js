import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import React, {useState, useEffect} from 'react';
import {Text, View, ScrollView} from 'react-native';
import RNCalendarEvents from 'react-native-calendar-events';


// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }


const App = () => {
  const [events, setEvents] = useState([]);

  const fetchCalendarEvents = async () => {
    try {
      const granted = await RNCalendarEvents.requestPermissions();

      if (granted) {
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 30);

        const fetchedEvents = await RNCalendarEvents.fetchAllEvents(
          startDate.toISOString(),
          endDate.toISOString(),
        );

        setEvents(fetchedEvents.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    }
  };

  useEffect(() => {
    fetchCalendarEvents();
  }, []);

  return (
    <View>
      <Text>Upcoming Calendar Events:</Text>
      <ScrollView>
        {events.map((event, index) => (
          <Text key={index}>{event.title}</Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
