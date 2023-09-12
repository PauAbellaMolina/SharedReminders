export type Group = {
  id: string;
  name: string;
  createdBy: string;
  private: boolean;
  reminders: Reminder[];
};

export type Reminder = {
  id: string;
  text: string;
  strikeThrough: boolean;
  groupId: string;
};

export type GroupsListProps = {
  selectedGroup: Group | undefined;
  setNewSelectedGroup: (group: Group | null) => void;
};

export type GroupProps = {
  group: Group;
  setNewSelectedGroup: (group: Group | null) => void;
};

export type ReminderProps = {
  reminder: Reminder;
};

export type AddNewReminderProps = {
  selectedGroup: Group | undefined;
  setNewSelectedGroup: (group: Group | null) => void;
};

export type AddNewGroupProps = {
  setAddingGroupState: (addingGroup: boolean) => void;
};
