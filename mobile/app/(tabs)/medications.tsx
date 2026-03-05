import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { medicationApi, MedicationReminder } from '../../services/api';

const DAYS = ['Nd', 'Pn', 'Wt', 'Sr', 'Cz', 'Pt', 'So'];

export default function MedicationsScreen() {
  const [reminders, setReminders] = useState<MedicationReminder[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [remindAt, setRemindAt] = useState('08:00');
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const response = await medicationApi.getAll();
      setReminders(response.data.data);
    } catch {
      // ignore
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadReminders();
    setRefreshing(false);
  }, []);

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const resetForm = () => {
    setMedicationName('');
    setDosage('');
    setRemindAt('08:00');
    setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
  };

  const handleSave = async () => {
    if (!medicationName.trim()) {
      Alert.alert('Błąd', 'Podaj nazwę leku.');
      return;
    }
    if (selectedDays.length === 0) {
      Alert.alert('Błąd', 'Wybierz przynajmniej jeden dzień.');
      return;
    }
    setSaving(true);
    try {
      await medicationApi.create({
        medication_name: medicationName.trim(),
        dosage: dosage.trim() || undefined,
        remind_at: remindAt,
        days_of_week: selectedDays,
      });
      setShowModal(false);
      resetForm();
      await loadReminders();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Błąd zapisu przypomnienia.';
      Alert.alert('Błąd', message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (reminder: MedicationReminder) => {
    try {
      await medicationApi.update(reminder.id, { is_active: !reminder.is_active });
      setReminders((prev) =>
        prev.map((r) => (r.id === reminder.id ? { ...r, is_active: !r.is_active } : r))
      );
    } catch {
      Alert.alert('Błąd', 'Nie udało się zmienić statusu.');
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert('Usunąć przypomnienie?', 'Tej operacji nie można cofnąć.', [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: async () => {
          try {
            await medicationApi.delete(id);
            setReminders((prev) => prev.filter((r) => r.id !== id));
          } catch {
            Alert.alert('Błąd', 'Nie udało się usunąć przypomnienia.');
          }
        },
      },
    ]);
  };

  const getDaysLabel = (days: number[]) =>
    days.length === 7 ? 'Codziennie' : days.map((d) => DAYS[d]).join(', ');

  const renderReminder = ({ item }: { item: MedicationReminder }) => (
    <View style={[styles.card, !item.is_active && styles.cardInactive]}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.medicationName, !item.is_active && styles.textInactive]}>
            {item.medication_name}
          </Text>
          {item.dosage ? (
            <Text style={styles.dosage}>{item.dosage}</Text>
          ) : null}
        </View>
        <Switch
          value={item.is_active}
          onValueChange={() => handleToggleActive(item)}
          trackColor={{ true: '#4CAF50' }}
        />
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.time}>{item.remind_at}</Text>
        <Text style={styles.days}>{getDaysLabel(item.days_of_week)}</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
        <Text style={styles.deleteButtonText}>Usuń</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={reminders}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderReminder}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4CAF50" />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Brak przypomnień</Text>
            <Text style={styles.emptySubtext}>Dodaj przypomnienie o leku</Text>
          </View>
        }
      />
      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView style={styles.modalContainer} contentContainerStyle={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nowe przypomnienie</Text>
              <TouchableOpacity onPress={() => { setShowModal(false); resetForm(); }}>
                <Text style={styles.modalClose}>Zamknij</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Nazwa leku</Text>
            <TextInput
              style={styles.input}
              value={medicationName}
              onChangeText={setMedicationName}
              placeholder="np. Cetirizyna"
            />

            <Text style={styles.label}>Dawkowanie (opcjonalne)</Text>
            <TextInput
              style={styles.input}
              value={dosage}
              onChangeText={setDosage}
              placeholder="np. 1 tabletka 10mg"
            />

            <Text style={styles.label}>Godzina przypomnienia</Text>
            <TextInput
              style={styles.input}
              value={remindAt}
              onChangeText={setRemindAt}
              placeholder="HH:MM"
              keyboardType="numbers-and-punctuation"
            />

            <Text style={styles.label}>Dni tygodnia</Text>
            <View style={styles.daysContainer}>
              {DAYS.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.dayButton, selectedDays.includes(index) && styles.daySelected]}
                  onPress={() => toggleDay(index)}
                >
                  <Text style={[styles.dayText, selectedDays.includes(index) && styles.dayTextSelected]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>
                {saving ? 'Zapisywanie...' : 'Zapisz przypomnienie'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardInactive: {
    opacity: 0.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  medicationName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  textInactive: {
    color: '#999',
  },
  dosage: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  cardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  time: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4CAF50',
  },
  days: {
    fontSize: 13,
    color: '#888',
  },
  deleteButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  deleteButtonText: {
    color: '#F44336',
    fontSize: 13,
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 30,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalContent: {
    padding: 20,
    paddingBottom: 48,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  modalClose: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  daysContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  daySelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  dayTextSelected: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
