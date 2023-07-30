import React, {useState, useEffect, useRef} from 'react';
import { Pressable, Text, View, KeyboardAvoidingView, FlatList, Button, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';
import { query, where, collection, collectionGroup, onSnapshot, doc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from './firebaseConfig';
import { GENERAL_GROUP_ID } from '@env'
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
  strikeThrough: boolean,
  groupId: string
};

type GroupsListProps = {
  setNewSelectedGroup: (group: Group | null) => void
};

type GroupProps = {
  group: Group,
  setNewSelectedGroup: (group: Group | null) => void
};

type ReminderProps = {
  reminder: Reminder
};

type AddNewReminderProps = {
  selectedGroup: Group | undefined,
  setNewSelectedGroup: (group: Group | null) => void
};

//--COMPONENTS----------------------------------

const GroupsList = ({setNewSelectedGroup}: GroupsListProps) => {
  const [groupsState, setGroupsState] = useState<Group[]>([]);

  const groups: Group[] = [];

  useEffect(() => {
    getDocs(collection(FIRESTORE_DB, 'groups')).then((querySnapshot) => {
      let i = 0;
      const querySnapshotSize = querySnapshot.size;
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
          i++;
          if (i === querySnapshotSize) {
            setGroupsState(groups);
            subscribeToGroups();
          }
        });
      });
    });
  }, []);

  const subscribeToGroups = () => {
    const subscriber = onSnapshot(collection(FIRESTORE_DB, 'groups'), {
      next: (snapshot) => {
        const resultGroups: Group[] = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            name: doc.data().name,
            reminders: []
          };
        });
        const newGroup = resultGroups.find((group) => !groups.some((groupState) => groupState.id === group.id));
        const deletedGroup = groups.find((group) => !resultGroups.some((groupState) => groupState.id === group.id));
        if (newGroup) {
          console.log("HEREEE->", newGroup);
          groups.push(newGroup);
          setGroupsState(groups);
        }
        if (deletedGroup) {
          console.log("DELETED->", deletedGroup);
          groups.splice(groups.indexOf(deletedGroup), 1);
          setGroupsState(groups);
        }
      }
    });
    return () => subscriber();
  };

  return (
    <FlatList
      style={{width: '100%', marginTop: 25}}
      data={groupsState}
      renderItem={({item}) => (<Group group={item} setNewSelectedGroup={setNewSelectedGroup} />)}
      keyExtractor={item => item.id}
    />
  )
};

const Group = ({group, setNewSelectedGroup}: GroupProps) => {
  const [groupState, setGroupState] = useState<Group>(group);
  const [collapsed, setCollapsed] = useState<boolean>(!groupState.reminders.length);

  useEffect(() => {
    const groupQuery = query(collection(FIRESTORE_DB, 'reminders'), where('groupId', '==', group.id));
    const subscriber = onSnapshot(groupQuery, {
      next: (snapshot) => {
        const updatedReminders = snapshot.docs.map((doc) => doc.id);
        const currentReminders = groupState.reminders.map((reminder) => reminder.id);
        if (updatedReminders.length !== currentReminders.length || updatedReminders.some((reminder) => !currentReminders.includes(reminder))) {
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

  const confirmDeleteGroup = () => {
    Alert.alert('Delete group "' + group.name + '"', ('Sure want to delete ' + group.name + ' and all it\'s reminders'), [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Delete', 
        onPress: () => deleteGroup()
      }
    ]);
  };

  const deleteGroup = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    groupState.reminders.forEach((reminder) => {
      deleteDoc(doc(FIRESTORE_DB, 'reminders', reminder.id));
    });
    deleteDoc(doc(FIRESTORE_DB, 'groups', groupState.id));
  };

  const onCollapse = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCollapsed(!collapsed);
  };

  const collapseGroupRender = () => {
    return (
      <View style={styles.collapseGroupView}>
        <Pressable onPress={() => onCollapse()}>
          {/* <Text style={styles.groupPressableText}></Text> */}
          <Ionicons name={collapsed ? 'chevron-down' : 'chevron-up'} size={24} color="black" />
        </Pressable>
      </View>
    )
  };

  const groupActionsRender = () => {
    if (groupState.id === GENERAL_GROUP_ID) {
      return;
    }
    return (
      <View>
        <View style={styles.separator} />
        <View style={styles.groupActionsRenderView}>
          <Pressable onPress={() => confirmDeleteGroup()}>
            <Text style={styles.deleteGroupText}>Delete group</Text>
          </Pressable>
          <Pressable onPress={() => setNewSelectedGroup(group)}>
            <Text style={styles.addNewReminderToGroupText}>Add new reminder</Text>
          </Pressable>
        </View>
      </View>
    )
  };

  return (
    <View style={styles.groupView}>
      {/* <Pressable onPress={() => onStrikeThrough(item.id)} delayLongPress={200} onLongPress={() => onDelete(item.id)}> */}
        <View style={styles.groupTitleRow}>
          <Text>{groupState.name}</Text>
          {groupState.reminders.length ? collapseGroupRender() : null}
        </View>
        <FlatList
          style={collapsed ? {display: 'none'} : {width: '100%', marginHorizontal: 7, marginBottom: 6, gap: 6}}
          data={groupState.reminders}
          renderItem={({item}) => (<Reminder reminder={item} />)}
          keyExtractor={item => item.id}
        />
        {groupActionsRender()}
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

const AddNewGroup = () => {
  const [newGroupName, setNewGroupName] = useState<string>('');

  const onAddGroup = () => {
    addDoc(collection(FIRESTORE_DB, 'groups'), {
      name: newGroupName
    });
    setNewGroupName('');
  };

  return (
    <View style={styles.addNewReminderInputView}>
      <TextInput
        style={styles.newReminderInput}
        onChangeText={setNewGroupName}
        value={newGroupName}
        placeholder="Add new group"
      />
      <Button
        title="Add group"
        onPress={onAddGroup}
      />
    </View>
  )
}

const AddNewReminder = ({selectedGroup, setNewSelectedGroup}: AddNewReminderProps) => { //TODO PAU update this to support groups
  const [newReminderText, setNewReminderText] = useState<string>('');

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (selectedGroup?.id) {
      inputRef.current?.focus();
    }
  }, [selectedGroup]);

  const onDeleteSelectedGroup = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNewSelectedGroup(null);
  };

  const onAddReminder = () => {
    addDoc(collection(FIRESTORE_DB, 'reminders'), {
      text: newReminderText,
      strikeThrough: false,
      groupId: selectedGroup?.id || GENERAL_GROUP_ID
    });
    setNewReminderText('');
  };

  const selectedGroupPill = () => {
    if (!selectedGroup?.id) {
      return;
    }
    return (
      <View style={styles.addNewReminderSelectedGroupPill}>
        <Pressable onPress={() => onDeleteSelectedGroup()}><Ionicons name="close" size={22} color="black" /></Pressable><Text>Add to {selectedGroup?.name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.addNewReminderView}>
      {selectedGroupPill()}
      <View style={styles.addNewReminderInputView}>
        <TextInput
          ref={inputRef}
          style={styles.newReminderInput}
          onChangeText={setNewReminderText}
          value={newReminderText}
          placeholder={selectedGroup?.name ? "Add new reminder to " + selectedGroup?.name : "Add new general reminder"}
          disableFullscreenUI={true}
        />
        <Button
          title="Add"
          onPress={onAddReminder}
        />
      </View>
    </View>
  )
}

//--APP MAIN COMPONENT--------------------------

export default function App() {
  const [selectedGroup, setSelectedGroup] = useState<Group>();

  const setNewSelectedGroup = (group: Group | null) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!group) {
      setSelectedGroup(undefined);
    }
    if (selectedGroup?.id !== group?.id && group?.id !== GENERAL_GROUP_ID) {
      setSelectedGroup(group as Group);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.bigTitle}>Shared Reminders</Text>
      <GroupsList setNewSelectedGroup={setNewSelectedGroup} />
      {/* <AddNewGroup /> */}
      <AddNewReminder selectedGroup={selectedGroup} setNewSelectedGroup={setNewSelectedGroup} />
    </KeyboardAvoidingView>
  );
}
