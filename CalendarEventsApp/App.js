import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Pressable, Linking, Platform } from 'react-native';
import * as Calendar from 'expo-calendar';

export default function App() {
  const [events, setEvents] = useState([]); // State to store fetched events
  const [selectedEvent, setSelectedEvent] = useState(null); // State to store the selected event

   // Fetch calendar events when the component mounts
  useEffect(() => {
    getCalendarEvents().then(setEvents);
  }, []);

  return (
    
    <View style={styles.container}>
      {selectedEvent ? (
        <EventDetails event={selectedEvent} onBack={() => setSelectedEvent(null)} />
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.upcomingEventsTitle}>Upcoming Events</Text>
          </View>
          
          <View style={styles.container2}>
          {events.map((event) => (
            <Pressable
              key={event.id}
              onPress={() => setSelectedEvent(event)}
              style={({ pressed }) => [
                styles.eventBox,
                { backgroundColor: pressed ? '#C89B42' : '#EDC87F' },
              ]}
            >
              <Text style={styles.eventText}>{event.title} {'>>'} </Text>
            </Pressable>
          ))}


          <Pressable onPress={openCalendarApp} 
                    style={({ pressed }) => [
                      styles.calendarButtonBox, 
                      {backgroundColor: pressed ? '#53A7C2' : '#7CC6DD' }
                      ]}>
            <Text style={styles.eventText}>Open Calendar App</Text>
          </Pressable>
          </View>
        </>
          
      )}
    </View>
  );
}



function EventDetails({ event, onBack }) {

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <View style={styles.detailsContainer}>

          <View style={styles.detailsHeader}>
            <Text style={styles.upcomingEventsTitle}>Event: {'\n'}{event.title}</Text>
          </View>

        <View style={styles.detailsContent}>
          <Text style={styles.eventDetailsText}>Start: {formatDate(new Date(event.startDate))}</Text>
          <Text style={styles.eventDetailsText}>End: {formatDate(new Date(event.endDate))}</Text>
          <Text style={styles.eventDetailsText}>Location: {event.location || 'N/A'}</Text>
        </View>

      <Pressable onPress={onBack} 
                  style={({ pressed }) => [
                  styles.eventBox, 
                  {backgroundColor: pressed ? '#53A7C2' : '#7CC6DD' }
                  ]}>
        <Text style={styles.eventText}>Go back</Text>
      </Pressable>

      <Pressable onPress={openCalendarApp} 
                  style={({ pressed }) => [
                  styles.calendarButtonBox, 
                  {backgroundColor: pressed ? '#C89B42' : '#EDC87F' }
                  ]}>
        <Text style={styles.eventText}>Open Calendar App</Text>
      </Pressable>


    </View>
  );
}





  // Function to open the calendar app
  const openCalendarApp = () => {
    const url = Platform.OS === 'ios' ? 'calshow://' : 'content://com.android.calendar/time/';
    Linking.openURL(url);
  };

async function getCalendarEvents() {
  // request permission to acces user's calendar
  const { status } = await Calendar.requestCalendarPermissionsAsync();

  if (status === 'granted') {
    // fetches list of all available calendars is user's devide
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    // Date object created for time and date
    const startDate = new Date();
    const endDate = new Date(startDate);
    // makes it so we only look up to a year ahead
    endDate.setFullYear(endDate.getFullYear() + 1);

    //gets all events in between start date and end date storing in events
    const events = await Calendar.getEventsAsync(
      calendars.map((calendar) => calendar.id),
      startDate,
      endDate
    );
    
    // sorts events in ascending order based on event's start date
    events.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    // return first 3
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

  },
  container2: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 80,
  },
  header: {
    backgroundColor: '#EDC87F', // Set the desired color here
    height: '25%', // This will make the header take up 1/4 of the page
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  eventBox: {
    backgroundColor: 'rgba(0, 150, 255, 1)',
    width: 250,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    marginTop: 50,
  },
  calendarButtonBox: {
    backgroundColor: 'rgba(210, 0 , 0, 1)',
    width: 400, 
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    marginTop: 100, 
  },
  eventText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  eventDetailsText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 25,
    marginTop: 10,
    marginBottom: 10,
  },
  upcomingEventsTitle: {
    color: '#fff',
    fontSize: 50,
    fontWeight: 'bold',
    marginTop: 100,
    marginBottom: 10,
  },
  regularText: {
    fontSize: 20,
    marginBottom: 10,
  },
  detailsContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    width: '100%'
  },
  centeredText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  detailsHeader: {
    backgroundColor: 'powderblue',
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  detailsContent: {
    paddingHorizontal: 10,
    marginTop: 50,
    marginBottom: 100,
  },
});

