import React, {useState, useEffect} from 'react';
import { Pressable, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import styles from '@styles/ReminderComponent';
import { Reminder, ReminderProps } from '@types';
import { FIRESTORE_DB } from '@firebaseConfig';

const ReminderComponent = ({reminder}: ReminderProps) => {
  const [reminderState, setReminderState] = useState<Reminder>(reminder);

  useEffect(() => {
    const reminderQuery = doc(FIRESTORE_DB, 'reminders', reminderState.id);
    const subscriber = onSnapshot(reminderQuery, {
      next: (snapshot) => {
        if (snapshot.data()) {
          if (snapshot.data()?.text !== reminderState.text || snapshot.data()?.strikeThrough !== reminderState.strikeThrough) {
            setReminderState({
              ...reminderState,
              text: snapshot.data()?.text,
              strikeThrough: snapshot.data()?.strikeThrough
            });
          }
        }
      }
    });
    return () => subscriber();
  });

  const onStrikeThrough = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateDoc(doc(FIRESTORE_DB, 'reminders', reminderState.id), {
      strikeThrough: !reminderState.strikeThrough
    });
  };

  const onDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    deleteDoc(doc(FIRESTORE_DB, 'reminders', reminderState.id));
  };

  return (
    <View style={styles.reminderView}>
      <Pressable style={styles.reminderView} onPress={() => onStrikeThrough()} delayLongPress={250} onLongPress={() => onDelete()}>
        <View style={styles.checkbox}><View style={reminderState.strikeThrough ? styles.checkboxChecked : styles.checkboxUnchecked}></View></View>
        <Text style={reminderState.strikeThrough ? [styles.reminderText, styles.reminderTextStrikeThrough] : styles.reminderText}>{reminderState.text}</Text>
      </Pressable>
    </View>
  );
};

export default ReminderComponent;