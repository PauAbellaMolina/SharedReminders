import React, {useState} from 'react';
import { Text, KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { GENERAL_GROUP_ID } from '@env'
import styles from './style'
import { Group } from '@types';
import GroupsListComponent from '@components/groups/GroupsListComponent';
import AddNewGroupComponent from '@components/groups/AddNewGroupComponent';
import AddNewReminderComponent from '@components/reminders/AddNewReminderComponent';

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
      <GroupsListComponent setNewSelectedGroup={setNewSelectedGroup} />
      {/* <AddNewGroupComponent /> */}
      <AddNewReminderComponent selectedGroup={selectedGroup} setNewSelectedGroup={setNewSelectedGroup} />
    </KeyboardAvoidingView>
  );
}
