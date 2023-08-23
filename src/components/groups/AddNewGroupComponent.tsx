import React, {useState} from 'react';
import { View, Button, TextInput } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import styles from '@styles/AddNewGroupComponent';
import { FIRESTORE_DB } from '@firebaseConfig';

const AddNewGroupComponent = () => {
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

export default AddNewGroupComponent;