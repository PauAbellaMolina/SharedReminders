import React, {useState} from 'react';
import { View, Text, Pressable, KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GENERAL_GROUP_ID } from '@env'
import styles from './style'
import { Group } from '@types';
import GroupsListComponent from '@components/groups/GroupsListComponent';
import AddNewGroupComponent from '@components/groups/AddNewGroupComponent';
import AddNewReminderComponent from '@components/reminders/AddNewReminderComponent';

export default function App() {
  const [selectedGroup, setSelectedGroup] = useState<Group>();
  const [addingGroup, setAddingGroup] = useState<boolean>(false);

  const setNewSelectedGroup = (group: Group | null) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!group) {
      setSelectedGroup(undefined);
    }
    if (selectedGroup?.id !== group?.id && group?.id !== GENERAL_GROUP_ID) {
      setSelectedGroup(group as Group);
    }
  };

  const onPressAddGroup = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAddingGroupState(true);
  };

  const setAddingGroupState = (addingGroup: boolean) => {
    setAddingGroup(addingGroup);
    // if (addedGroup) {
    //   setSelectedGroup(addedGroup);
    // }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.titleContainer}>
        <Text style={styles.bigTitle}>Shared Reminders</Text>
        <Pressable onPress={() => onPressAddGroup()}>
          <Ionicons name="add" size={40} color="black" />
        </Pressable>
      </View>
      <GroupsListComponent setNewSelectedGroup={setNewSelectedGroup} />
      {addingGroup
        ? <AddNewGroupComponent setAddingGroupState={setAddingGroupState} />
        : <AddNewReminderComponent selectedGroup={selectedGroup} setNewSelectedGroup={setNewSelectedGroup} />
      }
    </KeyboardAvoidingView>
  );
}
