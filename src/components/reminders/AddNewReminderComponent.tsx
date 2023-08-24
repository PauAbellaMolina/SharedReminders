import React, {useState, useEffect, useRef} from 'react';
import { Pressable, Text, View, Button, TextInput } from 'react-native';
import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';
import { collection, addDoc } from 'firebase/firestore';
import { GENERAL_GROUP_ID } from '@env';
import styles from '@styles/AddNewReminderComponent';
import { AddNewReminderProps } from '@types';
import { FIRESTORE_DB } from '@firebaseConfig';

const AddNewReminderComponent = ({selectedGroup, setNewSelectedGroup}: AddNewReminderProps) => {
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
      createdAt: new Date(),
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
        <Pressable onPress={() => onDeleteSelectedGroup()} style={styles.addNewReminderSelectedGroupPillPressable}><Ionicons name="close" size={22} color="black" /><Text>Add to {selectedGroup?.name}</Text></Pressable>
      </View>
    );
  };

  return (
    <View>
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

export default AddNewReminderComponent;