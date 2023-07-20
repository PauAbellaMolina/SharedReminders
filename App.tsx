import React, {useState, useEffect} from 'react';
import { Pressable, Text, View, KeyboardAvoidingView, FlatList, Button, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { query, where, collection, collectionGroup, onSnapshot, doc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from './firebaseConfig';
import styles from './style'

//--TYPES---------------------------------------

type Group = {
  id: string,
  name: string,
  reminders: Reminder[]
};

type Reminder = {
  id: string,
  text: string,
  strikeThrough: boolean
};

type GroupProps = {
  group: Group
};

type ReminderProps = {
  reminder: Reminder
};

//--COMPONENTS----------------------------------

const GroupsList = () => {
  const [groupsState, setGroupsState] = useState<Group[]>([]);

  useEffect(() => {
    const groups: Group[] = [];

    getDocs(collection(FIRESTORE_DB, 'groups')).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        getDocs(query(collection(FIRESTORE_DB, 'reminders'), where('groupId', '==', doc.id))).then((querySnapshot) => {
          const reminders: any[] = [];
          querySnapshot.forEach((doc) => {
            reminders.push({
              id: doc.id,
              ...doc.data()
            });
          });
          groups.push({
            id: doc.id,
            name: doc.data().name,
            reminders: reminders.reverse()
          });
          setGroupsState(groups);
        });
      });
    });
  }, []);

  return (
    <FlatList
      style={{width: '100%', marginTop: 20}}
      data={groupsState}
      renderItem={({item}) => (<Group group={item} />)}
      keyExtractor={item => item.id}
    />
  )
};

const Group = ({group}: GroupProps) => {
  const [groupState, setGroupState] = useState<Group>(group);

  useEffect(() => {
    const groupQuery = query(collection(FIRESTORE_DB, 'reminders'), where('groupId', '==', group.id));
    const subscriber = onSnapshot(groupQuery, {
      next: (snapshot) => {
        const updatedReminders = snapshot.docs.map((doc) => doc.id);
        const currentReminders = groupState.reminders.map((reminder) => reminder.id);
        if (updatedReminders.length !== currentReminders.length || updatedReminders.some((reminder) => !currentReminders.includes(reminder))) {
          console.log("here");
          getDocs(query(collection(FIRESTORE_DB, 'reminders'), where('groupId', '==', group.id))).then((querySnapshot) => {
            const reminders: any[] = [];
            querySnapshot.forEach((doc) => {
              reminders.push({
                id: doc.id,
                ...doc.data()
              });
            });
            setGroupState({
              ...groupState,
              reminders: reminders.reverse()
            });
          });
        }
      }
    });
    return () => subscriber();
  });

  return (
      <View style={styles.reminderView}>
      {/* <Pressable onPress={() => onStrikeThrough(item.id)} delayLongPress={200} onLongPress={() => onDelete(item.id)}> */}
      <View style={styles.separator} />
        <Text>{groupState.name}</Text>
        <FlatList
          style={{width: '100%', marginTop: 20}}
          data={groupState.reminders}
          renderItem={({item}) => (<Reminder reminder={item} />)}
          keyExtractor={item => item.id}
        />
      {/* </Pressable> */}
    </View>
  );
};

const Reminder = ({reminder}: ReminderProps) => {
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
      <Pressable onPress={() => onStrikeThrough()} delayLongPress={200} onLongPress={() => onDelete()}>
        <Text style={reminderState.strikeThrough ? [styles.reminderText, styles.reminderTextStrikeThrough] : styles.reminderText}>· {reminderState.text}</Text>
      </Pressable>
    </View>
  );
};

const AddNewReminder = () => { //TODO PAU update this to support groups
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
      <GroupsList />
      <AddNewReminder />
    </KeyboardAvoidingView>
  );
}
