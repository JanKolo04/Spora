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
} from 'react-native';
import { wellnessApi, WellnessEntry } from '../../services/api';

const RATING_EMOJIS = ['', '😫', '😟', '😐', '🙂', '😊'];
const RATING_LABELS = ['', 'Bardzo źle', 'Źle', 'Średnio', 'Dobrze', 'Bardzo dobrze'];
const RATING_COLORS = ['', '#F44336', '#FF9800', '#FFC107', '#8BC34A', '#4CAF50'];

const SYMPTOM_OPTIONS = [
  'Kichanie',
  'Katar',
  'Swędzenie oczu',
  'Łzawienie',
  'Kaszel',
  'Duszność',
  'Ból głowy',
  'Zmęczenie',
  'Problemy ze snem',
];

export default function WellnessScreen() {
  const [entries, setEntries] = useState<WellnessEntry[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [rating, setRating] = useState(0);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadEntries(1);
  }, []);

  const loadEntries = async (p: number) => {
    try {
      const response = await wellnessApi.getAll(p);
      if (p === 1) {
        setEntries(response.data.data);
      } else {
        setEntries((prev) => [...prev, ...response.data.data]);
      }
      setPage(p);
      setLastPage(response.data.meta.last_page);
    } catch {
      // ignore
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadEntries(1);
    setRefreshing(false);
  }, []);

  const onEndReached = async () => {
    if (page >= lastPage || loadingMore) return;
    setLoadingMore(true);
    await loadEntries(page + 1);
    setLoadingMore(false);
  };

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const resetForm = () => {
    setEntryDate(new Date().toISOString().split('T')[0]);
    setRating(0);
    setSelectedSymptoms([]);
    setNotes('');
  };

  const handleSave = async () => {
    if (rating === 0) {
      Alert.alert('Błąd', 'Wybierz ocenę samopoczucia.');
      return;
    }
    setSaving(true);
    try {
      await wellnessApi.create({
        entry_date: entryDate,
        rating,
        symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : undefined,
        notes: notes.trim() || undefined,
      });
      setShowModal(false);
      resetForm();
      await loadEntries(1);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Błąd zapisu wpisu.';
      Alert.alert('Błąd', message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert('Usunąć wpis?', 'Tej operacji nie można cofnąć.', [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: async () => {
          try {
            await wellnessApi.delete(id);
            setEntries((prev) => prev.filter((e) => e.id !== id));
          } catch {
            Alert.alert('Błąd', 'Nie udało się usunąć wpisu.');
          }
        },
      },
    ]);
  };

  const renderEntry = ({ item }: { item: WellnessEntry }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.entryDate}>{item.entry_date}</Text>
        <View style={[styles.ratingBadge, { backgroundColor: RATING_COLORS[item.rating] }]}>
          <Text style={styles.ratingEmoji}>{RATING_EMOJIS[item.rating]}</Text>
          <Text style={styles.ratingText}>{RATING_LABELS[item.rating]}</Text>
        </View>
      </View>
      {item.symptoms && item.symptoms.length > 0 && (
        <View style={styles.symptomsList}>
          {item.symptoms.map((s, i) => (
            <View key={i} style={styles.symptomTag}>
              <Text style={styles.symptomTagText}>{s}</Text>
            </View>
          ))}
        </View>
      )}
      {item.notes ? <Text style={styles.notesText}>{item.notes}</Text> : null}
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
        <Text style={styles.deleteButtonText}>Usuń</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderEntry}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4CAF50" />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Brak wpisów</Text>
            <Text style={styles.emptySubtext}>Dodaj wpis o samopoczuciu</Text>
          </View>
        }
        ListFooterComponent={loadingMore ? <Text style={styles.loadingMore}>Ładowanie...</Text> : null}
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
              <Text style={styles.modalTitle}>Samopoczucie</Text>
              <TouchableOpacity onPress={() => { setShowModal(false); resetForm(); }}>
                <Text style={styles.modalClose}>Zamknij</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Data</Text>
            <TextInput
              style={styles.input}
              value={entryDate}
              onChangeText={setEntryDate}
              placeholder="RRRR-MM-DD"
            />

            <Text style={styles.label}>Jak się czujesz?</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.ratingOption,
                    rating === r && { backgroundColor: RATING_COLORS[r], borderColor: RATING_COLORS[r] },
                  ]}
                  onPress={() => setRating(r)}
                >
                  <Text style={styles.ratingOptionEmoji}>{RATING_EMOJIS[r]}</Text>
                  <Text style={[styles.ratingOptionLabel, rating === r && { color: '#fff' }]}>
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Objawy (opcjonalne)</Text>
            <View style={styles.chipContainer}>
              {SYMPTOM_OPTIONS.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.chip, selectedSymptoms.includes(s) && styles.chipSelected]}
                  onPress={() => toggleSymptom(s)}
                >
                  <Text style={[styles.chipText, selectedSymptoms.includes(s) && styles.chipTextSelected]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Notatki (opcjonalne)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Dodatkowe uwagi..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>
                {saving ? 'Zapisywanie...' : 'Zapisz wpis'}
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  entryDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingEmoji: {
    fontSize: 14,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  symptomsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  symptomTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  symptomTagText: {
    fontSize: 13,
    color: '#2E7D32',
  },
  notesText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
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
  loadingMore: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 12,
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  ratingOption: {
    width: 56,
    height: 64,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
  ratingOptionEmoji: {
    fontSize: 22,
  },
  ratingOptionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  chipSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  chipText: {
    fontSize: 14,
    color: '#333',
  },
  chipTextSelected: {
    color: '#fff',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
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
