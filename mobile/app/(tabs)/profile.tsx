import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { pollenApi, profileApi, Pollen } from '../../services/api';
import PolandMap, { REGION_NAMES } from '../../components/PolandMap';

export default function ProfileScreen() {
  const { user, refreshUser, logout } = useAuth();

  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [region, setRegion] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savingRegion, setSavingRegion] = useState(false);

  const [pollens, setPollens] = useState<Pollen[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<number[]>([]);
  const [savingAllergens, setSavingAllergens] = useState(false);
  const [pollensLoading, setPollensLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setDateOfBirth(user.date_of_birth || '');
      setWeight(user.weight != null ? String(user.weight) : '');
      setHeight(user.height != null ? String(user.height) : '');
      setRegion(user.region || null);
      setSelectedAllergens(user.allergen_ids || []);
    }
  }, [user]);

  useEffect(() => {
    loadPollens();
  }, []);

  const loadPollens = async () => {
    try {
      const response = await pollenApi.getAll();
      setPollens(response.data.data);
    } catch {
      // ignore
    } finally {
      setPollensLoading(false);
    }
  };

  const toggleAllergen = (id: number) => {
    setSelectedAllergens((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await profileApi.update({
        name,
        date_of_birth: dateOfBirth || null,
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseInt(height, 10) : null,
        region: region,
      });
      await refreshUser();
      Alert.alert('Sukces', 'Profil został zaktualizowany.');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Błąd zapisu profilu.';
      Alert.alert('Błąd', message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveRegion = async () => {
    console.log('handleSaveRegion called, region:', region);
    setSavingRegion(true);
    try {
      console.log('Sending PUT /profile with:', { region });
      const response = await profileApi.update({ region });
      console.log('Response:', JSON.stringify(response.data));
      await refreshUser();
      Alert.alert('Sukces', 'Region został zapisany.');
    } catch (error: any) {
      console.log('Error saving region:', error.message, error.response?.status, JSON.stringify(error.response?.data));
      const message = error.response?.data?.message || 'Błąd zapisu regionu.';
      Alert.alert('Błąd', message);
    } finally {
      setSavingRegion(false);
    }
  };

  const handleSaveAllergens = async () => {
    setSavingAllergens(true);
    try {
      await profileApi.updateAllergens(selectedAllergens);
      await refreshUser();
      Alert.alert('Sukces', 'Alergeny zostały zaktualizowane.');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Błąd zapisu alergenów.';
      Alert.alert('Błąd', message);
    } finally {
      setSavingAllergens(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Wylogowanie', 'Czy na pewno chcesz się wylogować?', [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Wyloguj',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dane osobowe</Text>
        <TextInput style={styles.input} placeholder="Imię" value={name} onChangeText={setName} />
        <TextInput
          style={styles.input}
          placeholder="Data urodzenia (RRRR-MM-DD)"
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
        />
        <TextInput
          style={styles.input}
          placeholder="Waga (kg)"
          value={weight}
          onChangeText={setWeight}
          keyboardType="decimal-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Wzrost (cm)"
          value={height}
          onChangeText={setHeight}
          keyboardType="number-pad"
        />
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.buttonDisabled]}
          onPress={handleSaveProfile}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>{saving ? 'Zapisywanie...' : 'Zapisz'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Region</Text>
        {region ? (
          <View style={styles.currentRegion}>
            <Text style={styles.currentRegionLabel}>Wybrany region:</Text>
            <Text style={styles.currentRegionValue}>{REGION_NAMES[region] || region}</Text>
          </View>
        ) : (
          <Text style={styles.regionHint}>Nie wybrano regionu — wyświetlane są dane z całej Polski</Text>
        )}
        <PolandMap selected={region} onSelect={setRegion} />
        {region && (
          <TouchableOpacity onPress={() => setRegion(null)}>
            <Text style={styles.clearRegion}>Wyczyść wybór (pokaż całą Polskę)</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.saveButton, savingRegion && styles.buttonDisabled]}
          onPress={handleSaveRegion}
          disabled={savingRegion}
        >
          <Text style={styles.saveButtonText}>{savingRegion ? 'Zapisywanie...' : 'Zapisz region'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alergeny</Text>
        {pollensLoading ? (
          <ActivityIndicator size="small" color="#4CAF50" />
        ) : (
          <View style={styles.chipContainer}>
            {pollens.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[styles.chip, selectedAllergens.includes(p.id) && styles.chipSelected]}
                onPress={() => toggleAllergen(p.id)}
              >
                <Text style={[styles.chipText, selectedAllergens.includes(p.id) && styles.chipTextSelected]}>
                  {p.icon} {p.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <TouchableOpacity
          style={[styles.saveButton, savingAllergens && styles.buttonDisabled]}
          onPress={handleSaveAllergens}
          disabled={savingAllergens}
        >
          <Text style={styles.saveButtonText}>
            {savingAllergens ? 'Zapisywanie...' : 'Zapisz alergeny'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Wyloguj się</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
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
    backgroundColor: '#fafafa',
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
  },
  currentRegion: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  currentRegionLabel: {
    fontSize: 14,
    color: '#666',
  },
  currentRegionValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E7D32',
  },
  regionHint: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
  },
  clearRegion: {
    color: '#F44336',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  logoutButton: {
    backgroundColor: '#F44336',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
