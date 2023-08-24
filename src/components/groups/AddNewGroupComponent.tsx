import React, {useState, useEffect, useRef} from 'react';
import { View, Button, TextInput } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import styles from '@styles/AddNewGroupComponent';
import { FIRESTORE_DB } from '@firebaseConfig';
import { AddNewGroupProps } from '@types';

const AddNewGroupComponent = ({setAddingGroupState}: AddNewGroupProps) => {
  const [newGroupName, setNewGroupName] = useState<string>('');

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    inputRef.current?.focus();
  });

  const onAddGroup = () => {
    addDoc(collection(FIRESTORE_DB, 'groups'), {
      name: newGroupName
    }).finally(() => {
      setAddingGroupState(false);
      setNewGroupName('');
    });
  };

  const onCancel = () => {
    setAddingGroupState(false);
    setNewGroupName('');
  };

  return (
    <View style={styles.addNewReminderInputView}>
      <TextInput
        ref={inputRef}
        style={styles.newReminderInput}
        onChangeText={setNewGroupName}
        value={newGroupName}
        placeholder="Add new group"
      />
      <Button
        title="Cancel"
        color={'red'}
        onPress={onCancel}
      />
      <Button
        title="Add group"
        onPress={onAddGroup}
      />
    </View>
  )
}

export default AddNewGroupComponent;