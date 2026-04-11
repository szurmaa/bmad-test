import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Switch, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useReminderSettings } from '@/hooks/useReminderSettings';
import { useTheme } from '@/hooks/use-theme';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function parseTimeInput(raw: string): { hour: number; minute: number } | null {
  const match = raw.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

export function ReminderSettingsCard() {
  const theme = useTheme();
  const {
    isLoading,
    enabled,
    hour,
    minute,
    reminderType,
    doNotDisturbStart,
    doNotDisturbEnd,
    setEnabled,
    setTime,
    setReminderType,
    setDoNotDisturbWindow,
  } = useReminderSettings();

  const [timeInput, setTimeInput] = React.useState(`${pad(hour)}:${pad(minute)}`);
  const [dndStartInput, setDndStartInput] = React.useState(doNotDisturbStart ?? '22:00');
  const [dndEndInput, setDndEndInput] = React.useState(doNotDisturbEnd ?? '07:00');
  const [timeError, setTimeError] = React.useState<string | null>(null);
  const [dndError, setDndError] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  // Sync input field when hour/minute change externally (e.g. on load)
  React.useEffect(() => {
    setTimeInput(`${pad(hour)}:${pad(minute)}`);
  }, [hour, minute]);

  React.useEffect(() => {
    if (doNotDisturbStart) {
      setDndStartInput(doNotDisturbStart);
    }

    if (doNotDisturbEnd) {
      setDndEndInput(doNotDisturbEnd);
    }
  }, [doNotDisturbEnd, doNotDisturbStart]);

  const handleToggle = async (value: boolean) => {
    setIsSaving(true);
    try {
      await setEnabled(value);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTimeSubmit = async () => {
    const parsed = parseTimeInput(timeInput.trim());
    if (!parsed) {
      setTimeError('Enter a time in HH:MM format (e.g. 08:30)');
      return;
    }

    setTimeError(null);
    setIsSaving(true);
    try {
      await setTime(parsed.hour, parsed.minute);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDndSubmit = async () => {
    const parsedStart = parseTimeInput(dndStartInput.trim());
    const parsedEnd = parseTimeInput(dndEndInput.trim());
    if (!parsedStart || !parsedEnd) {
      setDndError('Use HH:MM for DND start/end times.');
      return;
    }

    setDndError(null);
    setIsSaving(true);
    try {
      await setDoNotDisturbWindow(
        `${pad(parsedStart.hour)}:${pad(parsedStart.minute)}`,
        `${pad(parsedEnd.hour)}:${pad(parsedEnd.minute)}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
        <ActivityIndicator color={theme.text} />
      </ThemedView>
    );
  }

  return (
    <ThemedView
      accessibilityLabel="Daily reminder settings"
      style={[styles.card, { backgroundColor: theme.backgroundElement }]}
      testID="reminder-settings-card">
      <View style={styles.row}>
        <View style={styles.labelBlock}>
          <ThemedText type="smallBold">Daily reminder</ThemedText>
          <ThemedText themeColor="textSecondary" type="small">
            {enabled ? 'Sends a nudge at your chosen time.' : 'No notifications will be sent.'}
          </ThemedText>
        </View>

        <Switch
          accessibilityLabel={enabled ? 'Disable daily reminder' : 'Enable daily reminder'}
          disabled={isSaving}
          onValueChange={(v) => void handleToggle(v)}
          testID="reminder-toggle"
          thumbColor={theme.background}
          trackColor={{ false: theme.backgroundSelected, true: theme.text }}
          value={enabled}
        />
      </View>

      {enabled ? (
        <View style={styles.timeRow}>
          <ThemedText type="small" style={styles.timeLabel}>
            Reminder frequency
          </ThemedText>

          <View style={styles.typeRow}>
            {(['daily', 'weekly', 'email_only'] as const).map((value) => {
              const isSelected = reminderType === value;
              return (
                <Pressable
                  key={value}
                  accessibilityRole="button"
                  accessibilityLabel={`Set reminder type ${value}`}
                  onPress={() => {
                    void setReminderType(value);
                  }}
                  style={({ pressed }) => [
                    styles.typeButton,
                    {
                      backgroundColor: isSelected ? theme.text : theme.background,
                      borderColor: theme.backgroundSelected,
                      opacity: pressed ? 0.9 : 1,
                    },
                  ]}
                  testID={`reminder-type-${value}`}>
                  <ThemedText type="small" style={isSelected ? styles.selectedTypeText : undefined}>
                    {value === 'email_only' ? 'Email only' : value[0].toUpperCase() + value.slice(1)}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          <ThemedText type="small" style={styles.timeLabel}>
            Reminder time
          </ThemedText>
          <View style={styles.timeInputRow}>
            <TextInput
              accessibilityLabel="Reminder time, format HH colon MM"
              keyboardType="numbers-and-punctuation"
              maxLength={5}
              onChangeText={setTimeInput}
              onSubmitEditing={() => void handleTimeSubmit()}
              placeholder="HH:MM"
              placeholderTextColor={theme.textSecondary}
              returnKeyType="done"
              style={[
                styles.timeInput,
                {
                  backgroundColor: theme.background,
                  borderColor: timeError ? '#E53E3E' : theme.backgroundSelected,
                  color: theme.text,
                },
              ]}
              testID="reminder-time-input"
              value={timeInput}
            />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Save reminder time"
              disabled={isSaving}
              onPress={() => void handleTimeSubmit()}
              style={({ pressed }) => [
                styles.saveButton,
                {
                  backgroundColor: pressed ? theme.backgroundSelected : theme.backgroundElement,
                  borderColor: theme.backgroundSelected,
                  opacity: isSaving ? 0.5 : 1,
                },
              ]}
              testID="reminder-save-button">
              <ThemedText type="small">{isSaving ? '…' : 'Save'}</ThemedText>
            </Pressable>
          </View>

          {timeError ? (
            <ThemedText type="small" style={styles.errorText}>
              {timeError}
            </ThemedText>
          ) : null}

          <ThemedText type="small" style={styles.timeLabel}>
            Do Not Disturb (HH:MM)
          </ThemedText>

          <View style={styles.dndRow}>
            <TextInput
              accessibilityLabel="DND start time"
              keyboardType="numbers-and-punctuation"
              maxLength={5}
              onChangeText={setDndStartInput}
              placeholder="22:00"
              placeholderTextColor={theme.textSecondary}
              returnKeyType="done"
              style={[
                styles.timeInput,
                {
                  backgroundColor: theme.background,
                  borderColor: dndError ? '#E53E3E' : theme.backgroundSelected,
                  color: theme.text,
                },
              ]}
              testID="dnd-start-input"
              value={dndStartInput}
            />

            <TextInput
              accessibilityLabel="DND end time"
              keyboardType="numbers-and-punctuation"
              maxLength={5}
              onChangeText={setDndEndInput}
              placeholder="07:00"
              placeholderTextColor={theme.textSecondary}
              returnKeyType="done"
              style={[
                styles.timeInput,
                {
                  backgroundColor: theme.background,
                  borderColor: dndError ? '#E53E3E' : theme.backgroundSelected,
                  color: theme.text,
                },
              ]}
              testID="dnd-end-input"
              value={dndEndInput}
            />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Save DND window"
              disabled={isSaving}
              onPress={() => void handleDndSubmit()}
              style={({ pressed }) => [
                styles.saveButton,
                {
                  backgroundColor: pressed ? theme.backgroundSelected : theme.backgroundElement,
                  borderColor: theme.backgroundSelected,
                  opacity: isSaving ? 0.5 : 1,
                },
              ]}
              testID="dnd-save-button">
              <ThemedText type="small">{isSaving ? '…' : 'Save'}</ThemedText>
            </Pressable>
          </View>

          {dndError ? (
            <ThemedText type="small" style={styles.errorText}>
              {dndError}
            </ThemedText>
          ) : null}
        </View>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.three,
    justifyContent: 'space-between',
  },
  labelBlock: {
    flex: 1,
    gap: 2,
  },
  timeRow: {
    gap: Spacing.two,
  },
  timeLabel: {
    fontWeight: '600',
  },
  timeInputRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  typeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.one,
  },
  typeButton: {
    borderRadius: 10,
    borderWidth: 1,
    minHeight: 36,
    paddingHorizontal: Spacing.two,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTypeText: {
    color: '#FFFFFF',
  },
  dndRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.one,
  },
  timeInput: {
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    height: 44,
    paddingHorizontal: Spacing.two,
    fontSize: 16,
  },
  saveButton: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  errorText: {
    color: '#E53E3E',
  },
});

export default ReminderSettingsCard;
