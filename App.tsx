import React, {useState, useEffect} from 'react';
import { Pressable, Text, View, KeyboardAvoidingView, FlatList, Button, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from './firebaseConfig';
import styles from './style'

//--TYPES---------------------------------------

type Reminder = {
  id: string,
  text: string,
  strikeThrough: boolean
};

type ReminderProps = {
  item: Reminder,
  onStrikeThrough: (id: string) => void,
  onDelete: (id: string) => void
};

//--COMPONENTS----------------------------------

const RemindersList = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    const subscriber = onSnapshot(collection(FIRESTORE_DB, 'reminders'), {
      next: (snapshot) => {
        const reminders: any[] = [];
        snapshot.docs.forEach((doc) => {
          reminders.push({
            id: doc.id,
            ...doc.data()
          });
        });
  
        setReminders(reminders.reverse());
      }
    });
    return () => subscriber();
  }, []);

  const onStrikeThrough = (id: string) => {
    setReminders(reminders.map(reminder => {
      if (reminder.id === id) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // reminder.strikeThrough = !reminder.strikeThrough;
        updateDoc(doc(FIRESTORE_DB, 'reminders', reminder.id), {
          strikeThrough: !reminder.strikeThrough
        });
      }
      return reminder;
    }));
  };

  const onDelete = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    deleteDoc(doc(FIRESTORE_DB, 'reminders', id));
  };
  
  return (
    <FlatList
      style={{width: '100%', marginTop: 20}}
      data={reminders}
      renderItem={({item}) => (<Reminder item={item} onStrikeThrough={onStrikeThrough} onDelete={onDelete} />)}
      keyExtractor={item => item.id}
    />
  )
}

const Reminder = ({item, onStrikeThrough, onDelete}: ReminderProps) => (
  <View style={styles.reminderView}>
    <Pressable onPress={() => onStrikeThrough(item.id)} delayLongPress={200} onLongPress={() => onDelete(item.id)}>
      <Text style={item.strikeThrough ? [styles.reminderText, styles.reminderTextStrikeThrough] : styles.reminderText}>· {item.text}</Text>
    </Pressable>
    <View style={styles.separator} />
  </View>
);

const AddNewReminder = () => {
  const [newReminderText, setNewReminderText] = useState<string>('');

  const onAddReminder = () => {
    addDoc(collection(FIRESTORE_DB, 'reminders'), {
      text: newReminderText,
      strikeThrough: false
    });
    setNewReminderText('');
  };

  return (
    <View style={styles.addNewReminderView}>
      <TextInput
        style={styles.newReminderInput}
        onChangeText={setNewReminderText}
        value={newReminderText}
        placeholder="Add new reminder"
      />
      <Button
        title="Add"
        onPress={onAddReminder}
      />
    </View>
  )
}

//--APP MAIN COMPONENT--------------------------

export default function App() {

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.bigTitle}>Shared Reminders</Text>
      <RemindersList/>
      <AddNewReminder />
    </KeyboardAvoidingView>
  );
}
