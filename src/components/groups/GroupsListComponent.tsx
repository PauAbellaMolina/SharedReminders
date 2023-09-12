import React, {useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { query, where, collection, onSnapshot, getDocs, or } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Group, GroupsListProps } from '@types';
import { FIRESTORE_DB } from '@firebaseConfig';
import GroupComponent from '@components/groups/GroupComponent';
import { useAuth } from '@clerk/clerk-expo';
import { GENERAL_GROUP_ID } from '@env';

const GroupsListComponent = ({selectedGroup, setNewSelectedGroup}: GroupsListProps) => {
  const [groupsState, setGroupsState] = useState<Group[]>([]);
  
  const { userId } = useAuth();

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
    getDocs(query(collection(FIRESTORE_DB, 'groups'), or(where('createdBy', '==', userId), where('private', '==', false)))).then((querySnapshot) => {
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
            createdBy: doc.data().createdBy,
            private: doc.data().private,
            reminders: reminders.sort((a, b) => a?.createdAt?.seconds - b?.createdAt?.seconds).reverse()
          });
          i++;
          if (i === querySnapshotSize) {
            console.log("GROUPS->", groups);
            //place group with ID GENERAL_GROUP_ID at the start of the array
            // const generalGroupIndex = groups.findIndex((group) => group.id === GENERAL_GROUP_ID);
            // if (generalGroupIndex !== -1) {
            //   groups.unshift(groups.splice(generalGroupIndex, 1)[0]);
            // }
            setGroupsState(groups);
            subscribeToGroups();
          }
        });
      });
    });
  }, []);

  const subscribeToGroups = () => {
    const subscriber = onSnapshot(query(collection(FIRESTORE_DB, 'groups'), or(where('createdBy', '==', userId), where('private', '==', false))), {
      next: (snapshot) => {
        const resultGroups: Group[] = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            name: doc.data().name,
            createdBy: doc.data().createdBy,
            private: doc.data().private,
            reminders: []
          };
        });
        const newGroup = resultGroups.find((group) => !groups.some((groupState) => groupState.id === group.id));
        const deletedGroup = groups.find((group) => !resultGroups.some((groupState) => groupState.id === group.id));
        if (newGroup) {
          console.log("NEW GROUP->", newGroup);
          setNewSelectedGroup(newGroup);
          groups.push(newGroup);
          setGroupsState(groups);
        }
        if (deletedGroup) {
          console.log("DELETED->", selectedGroup, deletedGroup);
          if (selectedGroup?.id === deletedGroup.id) {
            setNewSelectedGroup(null);
          }
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