import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import {
  createOrUpdateCatalogTask,
  deactivateCatalogTask,
  readCatalogTasks,
  type TaskCatalogInput,
} from '@/features/admin-task-catalog/TaskCatalogService';

const defaultForm: TaskCatalogInput = {
  id: '',
  category: 'Mind',
  title: '',
  description: '',
  effortLevel: 'quick',
  isActive: true,
};

export default function AdminTasksScreen() {
  const [form, setForm] = React.useState<TaskCatalogInput>(defaultForm);
  const [errors, setErrors] = React.useState<Partial<Record<keyof TaskCatalogInput, string>>>({});
  const [tasks, setTasks] = React.useState<Array<{ id: string; title: string; isActive: boolean }>>([]);
  const [loading, setLoading] = React.useState(false);

  const refresh = React.useCallback(async () => {
    const rows = await readCatalogTasks();
    setTasks(rows.map((row) => ({ id: row.id, title: row.title, isActive: row.isActive })));
  }, []);

  React.useEffect(() => {
    refresh().catch(() => {});
  }, [refresh]);

  const save = React.useCallback(async () => {
    setLoading(true);
    const result = await createOrUpdateCatalogTask(form);
    setErrors(result.fieldErrors);

    if (result.valid) {
      setForm(defaultForm);
      await refresh();
    }

    setLoading(false);
  }, [form, refresh]);

  const deactivate = React.useCallback(async (taskId: string) => {
    await deactivateCatalogTask(taskId);
    await refresh();
  }, [refresh]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.container}>
          <ThemedText type="subtitle">Admin Task Catalog</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Internal curation tool for create, edit, and deactivate operations.
          </ThemedText>

          <View style={styles.formGroup}>
            <Label text="Task ID" error={errors.id} />
            <TextInput
              value={form.id}
              onChangeText={(value) => setForm((prev) => ({ ...prev, id: value }))}
              style={styles.input}
              autoCapitalize="none"
              placeholder="task_custom_001"
              testID="admin-task-id-input"
            />

            <Label text="Title" error={errors.title} />
            <TextInput
              value={form.title}
              onChangeText={(value) => setForm((prev) => ({ ...prev, title: value }))}
              style={styles.input}
              placeholder="Morning stretch"
              testID="admin-task-title-input"
            />

            <Label text="Description" error={errors.description} />
            <TextInput
              value={form.description}
              onChangeText={(value) => setForm((prev) => ({ ...prev, description: value }))}
              style={[styles.input, styles.textArea]}
              placeholder="10-minute guided stretch sequence"
              multiline
              testID="admin-task-description-input"
            />

            <Label text="Category" error={errors.category} />
            <SegmentedValues
              values={['Mind', 'Body', 'Life', 'Work']}
              selected={form.category}
              onSelect={(value) => setForm((prev) => ({ ...prev, category: value as TaskCatalogInput['category'] }))}
            />

            <Label text="Effort" error={errors.effortLevel} />
            <SegmentedValues
              values={['quick', 'medium', 'involved']}
              selected={form.effortLevel}
              onSelect={(value) => setForm((prev) => ({ ...prev, effortLevel: value as TaskCatalogInput['effortLevel'] }))}
            />

            <View style={styles.switchRow}>
              <ThemedText>Active</ThemedText>
              <Switch
                value={form.isActive}
                onValueChange={(value) => setForm((prev) => ({ ...prev, isActive: value }))}
                testID="admin-task-active-switch"
              />
            </View>

            <Pressable style={styles.primaryButton} onPress={() => save().catch(() => {})} disabled={loading}>
              <ThemedText style={styles.primaryButtonText}>{loading ? 'Saving...' : 'Save task'}</ThemedText>
            </Pressable>
          </View>

          <View style={styles.listSection}>
            <ThemedText type="subtitle" style={styles.listTitle}>Catalog</ThemedText>
            {tasks.map((task) => (
              <View key={task.id} style={styles.listRow}>
                <View style={styles.listRowText}>
                  <ThemedText>{task.title}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {task.id} · {task.isActive ? 'active' : 'inactive'}
                  </ThemedText>
                </View>
                {task.isActive && (
                  <Pressable style={styles.secondaryButton} onPress={() => deactivate(task.id).catch(() => {})}>
                    <ThemedText type="smallBold">Deactivate</ThemedText>
                  </Pressable>
                )}
              </View>
            ))}
          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

function Label({ text, error }: { text: string; error?: string }) {
  return (
    <View style={styles.labelRow}>
      <ThemedText type="smallBold">{text}</ThemedText>
      {error ? <ThemedText type="small" style={styles.errorText}>{error}</ThemedText> : null}
    </View>
  );
}

function SegmentedValues({
  values,
  selected,
  onSelect,
}: {
  values: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.segmentRow}>
      {values.map((value) => (
        <Pressable
          key={value}
          style={[styles.segmentButton, selected === value && styles.segmentButtonActive]}
          onPress={() => onSelect(value)}>
          <ThemedText type="smallBold">{value}</ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: Spacing.three, alignItems: 'center' },
  container: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.three,
    paddingBottom: Spacing.five,
  },
  formGroup: {
    gap: Spacing.two,
    borderRadius: 12,
    padding: Spacing.three,
    backgroundColor: '#F5F5F7',
  },
  labelRow: { gap: Spacing.one },
  errorText: { color: '#B42318' },
  input: {
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  textArea: { minHeight: 84, textAlignVertical: 'top' },
  segmentRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  segmentButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
  segmentButtonActive: {
    borderColor: '#175CD3',
    backgroundColor: '#EFF4FF',
  },
  switchRow: {
    marginTop: Spacing.one,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  primaryButton: {
    marginTop: Spacing.two,
    borderRadius: 10,
    backgroundColor: '#175CD3',
    alignItems: 'center',
    paddingVertical: 12,
  },
  primaryButtonText: { color: '#FFFFFF', fontWeight: 700 },
  listSection: { gap: Spacing.two },
  listTitle: { fontSize: 22, lineHeight: 28 },
  listRow: {
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    padding: Spacing.two,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  listRowText: { flex: 1, gap: Spacing.one },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#F04438',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FFF5F5',
  },
});
