import React, {useState, useEffect} from 'react';
import { Pressable, Text, View, FlatList, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from './firebaseConfig';
import styles from './style'

//--TYPES---------------------------------------

type Item = {
  id: string,
  text: string,
  strikeThrough: boolean,
  deleted: boolean
};

type ItemProps = {
  item: Item,
  onStrikeThrough: (id: string) => void,
  onDelete: (id: string) => void
};

//--COMPONENTS----------------------------------

const DATA: Item[] = [ //TODO PAU this should be retrieved from firestore
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    text: 'First Item',
    strikeThrough: false,
    deleted: false
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    text: 'Second Item',
    strikeThrough: false,
    deleted: false
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    text: 'Third Item',
    strikeThrough: false,
    deleted: false
  }
];

const Item = ({item, onStrikeThrough, onDelete}: ItemProps) => (
  <View style={styles.item}>
    <Pressable onPress={() => onStrikeThrough(item.id)} delayLongPress={200} onLongPress={() => onDelete(item.id)}>
      <Text style={item.deleted ? [styles.itemText, styles.itemTextDeleted] : item.strikeThrough ? [styles.itemText, styles.itemTextStrikeThrough] : styles.itemText}>· {item.text}</Text>
    </Pressable>
  </View>
);

//--APP MAIN COMPONENT--------------------------

export default function App() {
  const [reminders, setReminders] = useState<Item[]>([]);

  useEffect(() => {
    const remindersRef = collection(FIRESTORE_DB, 'reminders');
  
    const subscriber = onSnapshot(remindersRef, {
      next: (snapshot) => {
        const reminders: any[] = [];
        snapshot.docs.forEach((doc) => {
          reminders.push({
            id: doc.id,
            ...doc.data()
          });
        });
  
        setReminders(reminders);
      }
    });
    return () => subscriber();
  }, []);

  const onStrikeThrough = (id: string) => {
    setReminders(reminders.map(reminder => {
      if (reminder.id === id && !reminder.deleted) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // reminder.strikeThrough = !reminder.strikeThrough;
        const reminderRef = doc(FIRESTORE_DB, 'reminders', reminder.id);
        updateDoc(reminderRef, {
          strikeThrough: !reminder.strikeThrough
        });
      }
      return reminder;
    }));
  };

  const onDelete = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setReminders(reminders.map(reminder => {
      if (reminder.id === id) {
        // reminder.deleted = !reminder.deleted;
        const reminderRef = doc(FIRESTORE_DB, 'reminders', reminder.id);
        updateDoc(reminderRef, {
          deleted: !reminder.deleted
        });
      }
      return reminder;
    }));
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.bigTitle}>Shared Reminders</Text>
      <FlatList
        style={{width: '100%', marginTop: 20}}
        data={reminders}
        // renderItem={({item}) => (!item.deleted ? <Item item={item} onStrikeThrough={onStrikeThrough} onDelete={onDelete} /> : null)}
        renderItem={({item}) => (<Item item={item} onStrikeThrough={onStrikeThrough} onDelete={onDelete} />)}
        keyExtractor={item => item.id}
      />
    </View>
  );
}
