import React, {useState, useEffect} from 'react';
import { Pressable, Text, View, FlatList, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';
import { query, where, collection, onSnapshot, doc, getDocs, deleteDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GENERAL_GROUP_ID } from '@env';
import styles from '@styles/GroupComponent';
import { Group, GroupProps } from '@types';
import { FIRESTORE_DB } from '@firebaseConfig';
import ReminderComponent from '@components/reminders/ReminderComponent';

const GroupComponent = ({group, setNewSelectedGroup}: GroupProps) => {
    const [groupState, setGroupState] = useState<Group>(group);
    const [collapsed, setCollapsed] = useState<boolean>(!groupState.reminders.length);
  
    const setStringValue = async (value: any) => {
      try {
        await AsyncStorage.setItem(group.id, value)
      } catch(e) {
        console.error(e);
      }
    }
  
    const getMyStringValue = async () => {
      try {
        return await AsyncStorage.getItem(group.id)
      } catch(e) {
        console.error(e);
      }
    }
  
    useEffect(() => {
      getMyStringValue().then((value) => {
        if (!value) {
          setStringValue(JSON.stringify(collapsed));
          return;
        }
        setCollapsed(JSON.parse(value));
      });
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
      setStringValue(JSON.stringify(!collapsed));
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
            renderItem={({item}) => (<ReminderComponent reminder={item} />)}
            keyExtractor={item => item.id}
          />
          {groupActionsRender()}
        {/* </Pressable> */}
      </View>
    );
  };

  export default GroupComponent;