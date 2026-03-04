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
import { symptomReportApi, SymptomReport } from '../../services/api';

const SEVERITY_OPTIONS = [
  { label: 'Niski', value: 'niski', color: '#4CAF50' },
  { label: 'Średni', value: 'średni', color: '#FFC107' },
  { label: 'Wysoki', value: 'wysoki', color: '#FF9800' },
  { label: 'Bardzo wysoki', value: 'bardzo wysoki', color: '#F44336' },
];

const SYMPTOM_OPTIONS = [
  'Kichanie',
  'Katar',
  'Swędzenie oczu',
  'Łzawienie',
  'Kaszel',
  'Duszność',
  'Ból głowy',
  'Wysypka',
];

export default function ReportsScreen() {
  const [reports, setReports] = useState<SymptomReport[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [severity, setSeverity] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadReports(1);
  }, []);

  const loadReports = async (p: number) => {
    try {
      const response = await symptomReportApi.getAll(p);
      if (p === 1) {
        setReports(response.data.data);
      } else {
        setReports((prev) => [...prev, ...response.data.data]);
      }
      setPage(p);
      setLastPage(response.data.meta.last_page);
    } catch {
      // ignore
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadReports(1);
    setRefreshing(false);
  }, []);

  const onEndReached = async () => {
    if (page >= lastPage || loadingMore) return;
    setLoadingMore(true);
    await loadReports(page + 1);
    setLoadingMore(false);
  };

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const addCustomSymptom = () => {
    const trimmed = customSymptom.trim();
    if (trimmed && !selectedSymptoms.includes(trimmed)) {
      setSelectedSymptoms((prev) => [...prev, trimmed]);
      setCustomSymptom('');
    }
  };

  const resetForm = () => {
    setReportDate(new Date().toISOString().split('T')[0]);
    setSeverity('');
    setSelectedSymptoms([]);
    setCustomSymptom('');
    setNotes('');
  };

  const handleSave = async () => {
    if (!severity) {
      Alert.alert('Błąd', 'Wybierz poziom nasilenia.');
      return;
    }
    if (selectedSymptoms.length === 0) {
      Alert.alert('Błąd', 'Wybierz przynajmniej jeden objaw.');
      return;
    }
    setSaving(true);
    try {
      await symptomReportApi.create({
        report_date: reportDate,
        severity,
        symptoms: selectedSymptoms,
        notes: notes || undefined,
      });
      setShowModal(false);
      resetForm();
      await loadReports(1);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Błąd zapisu raportu.';
      Alert.alert('Błąd', message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert('Usunąć raport?', 'Tej operacji nie można cofnąć.', [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: async () => {
          try {
            await symptomReportApi.delete(id);
            setReports((prev) => prev.filter((r) => r.id !== id));
          } catch {
            Alert.alert('Błąd', 'Nie udało się usunąć raportu.');
          }
        },
      },
    ]);
  };

  const getSeverityColor = (s: string) => {
    return SEVERITY_OPTIONS.find((o) => o.value === s)?.color || '#999';
  };

  const renderReport = ({ item }: { item: SymptomReport }) => (
    <View style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <Text style={styles.reportDate}>{item.report_date}</Text>
        <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(item.severity) }]}>
          <Text style={styles.severityText}>{item.severity}</Text>
        </View>
      </View>
      <View style={styles.symptomsList}>
        {item.symptoms.map((s, i) => (
          <View key={i} style={styles.symptomTag}>
            <Text style={styles.symptomTagText}>{s}</Text>
          </View>
        ))}
      </View>
      {item.notes ? <Text style={styles.notesText}>{item.notes}</Text> : null}
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
        <Text style={styles.deleteButtonText}>Usuń</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCreateModal = () => (
    <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.modalContainer} contentContainerStyle={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nowy raport</Text>
            <TouchableOpacity onPress={() => { setShowModal(false); resetForm(); }}>
              <Text style={styles.modalClose}>Zamknij</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Data</Text>
          <TextInput
            style={styles.input}
            value={reportDate}
            onChangeText={setReportDate}
            placeholder="RRRR-MM-DD"
          />

          <Text style={styles.label}>Nasilenie</Text>
          <View style={styles.severityContainer}>
            {SEVERITY_OPTIONS.map((o) => (
              <TouchableOpacity
                key={o.value}
                style={[
                  styles.severityOption,
                  { borderColor: o.color },
                  severity === o.value && { backgroundColor: o.color },
                ]}
                onPress={() => setSeverity(o.value)}
              >
                <Text
                  style={[
                    styles.severityOptionText,
                    severity === o.value && { color: '#fff' },
                  ]}
                >
                  {o.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Objawy</Text>
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
          <View style={styles.customSymptomRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Inny objaw..."
              value={customSymptom}
              onChangeText={setCustomSymptom}
              onSubmitEditing={addCustomSymptom}
            />
            <TouchableOpacity style={styles.addButton} onPress={addCustomSymptom}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          {selectedSymptoms.filter((s) => !SYMPTOM_OPTIONS.includes(s)).map((s, i) => (
            <View key={i} style={[styles.chip, styles.chipSelected, { marginTop: 8 }]}>
              <Text style={styles.chipTextSelected}>{s}</Text>
            </View>
          ))}

          <Text style={[styles.label, { marginTop: 16 }]}>Notatki (opcjonalne)</Text>
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
              {saving ? 'Zapisywanie...' : 'Zapisz raport'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={reports}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderReport}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4CAF50" />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Brak raportów</Text>
            <Text style={styles.emptySubtext}>Dodaj pierwszy raport objawów</Text>
          </View>
        }
        ListFooterComponent={loadingMore ? <Text style={styles.loadingMore}>Ładowanie...</Text> : null}
      />
      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
      {renderCreateModal()}
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
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reportDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
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
  severityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  severityOption: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: '#fff',
  },
  severityOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
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
  customSymptomRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
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
