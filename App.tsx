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

    //TODO PAU figure subscriptions out - next example doesnt quite work on first group idk why and probably does too many queries to firebase
    //TODO PAU -> maybe subscribint to each reminder? if firebase can handle it; see below
    // const remindersQuery = query(collection(FIRESTORE_DB, 'reminders'));
    // const subscriber = onSnapshot(remindersQuery, {
    //   next: (snapshot) => {
    //     const groups: Group[] = [];
    //     console.log("Here");
    //     getDocs(collection(FIRESTORE_DB, 'groups')).then((querySnapshot) => {
    //       querySnapshot.forEach((doc) => {
    //         getDocs(query(collection(FIRESTORE_DB, 'reminders'), where('groupId', '==', doc.id))).then((querySnapshot) => {
    //           const reminders: any[] = [];
    //           querySnapshot.forEach((doc) => {
    //             reminders.push({
    //               id: doc.id,
    //               ...doc.data()
    //             });
    //           });
    //           groups.push({
    //             id: doc.id,
    //             name: doc.data().name,
    //             reminders: reminders.reverse()
    //           });
    //           setGroupsState(groups);
    //         });
    //       });
    //     });
    //     // let groupsAux = groupsState;
    //     // snapshot.docs.forEach((doc) => {
    //     //   // remindersAux.push({
    //     //   //   id: doc.id,
    //     //   //   ...doc.data()
    //     //   // });
    //     //   groupsAux.forEach((group) => {
    //     //     let reminderToUpdate = group.reminders.find((reminder) => reminder.id === doc.id);
    //     //     if (reminderToUpdate) {
    //     //       reminderToUpdate.text = doc.data().text;
    //     //       reminderToUpdate.strikeThrough = doc.data().strikeThrough;
    //     //     }
    //     //   });
    //     // });
    //     // console.log(groupsAux, groupsState);
    //     // // setGroupsState(groupsAux);
    //   }
    // });
    // return () => subscriber();
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

const Group = ({group}: GroupProps) => (
  <View style={styles.reminderView}>
    {/* <Pressable onPress={() => onStrikeThrough(item.id)} delayLongPress={200} onLongPress={() => onDelete(item.id)}> */}
    <View style={styles.separator} />
      <Text>{group.name}</Text>
      <FlatList
        style={{width: '100%', marginTop: 20}}
        data={group.reminders}
        renderItem={({item}) => (<Reminder reminder={item} />)}
        keyExtractor={item => item.id}
      />
    {/* </Pressable> */}
  </View>
);

const Reminder = ({reminder}: ReminderProps) => {
  const [reminderState, setReminderState] = useState<Reminder>(reminder);

  //TODO PAU -> trying to subscribe to each reminder
  useEffect(() => {
    const remindersQuery = doc(FIRESTORE_DB, 'reminders', reminderState.id);
    // const remindersQuery = collection(FIRESTORE_DB, 'reminders');
    const subscriber = onSnapshot(remindersQuery, {
      next: (snapshot) => {
        console.log("here", snapshot.data());
        // setReminderState({
        //   id: snapshot.id,
        //   ...snapshot.data()
        // });
        // snapshot.docs.forEach((doc) => {
        //   console.log(doc.data());
        //   setReminderState({
        //     id: doc.id,
        //     ...doc.data()
        //   });
        // });
      }
    });
    return () => subscriber();
  });

  const onStrikeThrough = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setReminderState({
      ...reminderState,
      strikeThrough: !reminderState.strikeThrough
    });
    updateDoc(doc(FIRESTORE_DB, 'reminders', reminderState.id), {
      strikeThrough: !reminderState.strikeThrough
    });
  };

  const onDelete = () => { //TODO PAU what do we do here? i guess emit to the parent to remove the reminder from the array (updating parents state) and rerender; nah, should be updated on firebase subscription
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
