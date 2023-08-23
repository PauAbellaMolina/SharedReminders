import React, {useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { query, where, collection, onSnapshot, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Group, GroupsListProps } from '@types';
import { FIRESTORE_DB } from '@firebaseConfig';
import GroupComponent from '@components/groups/GroupComponent';

const GroupsListComponent = ({setNewSelectedGroup}: GroupsListProps) => {
  const [groupsState, setGroupsState] = useState<Group[]>([]);

  const groups: Group[] = [];

  const clearAll = async () => {
    try {
      await AsyncStorage.clear()
    } catch(e) {
      console.error(e);
    }
    console.log('CLEARED')
  }

  useEffect(() => {
    // clearAll();
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
      renderItem={({item}) => (<GroupComponent group={item} setNewSelectedGroup={setNewSelectedGroup} />)}
      keyExtractor={item => item.id}
    />
  )
};

export default GroupsListComponent;