import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { pollenApi, Pollen, RegisterData } from '../../services/api';
import PolandMap from '../../components/PolandMap';

const TOTAL_STEPS = 4;

export default function RegisterScreen() {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [region, setRegion] = useState<string | null>(null);

  const [dateOfBirth, setDateOfBirth] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const [pollens, setPollens] = useState<Pollen[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<number[]>([]);
  const [pollensLoading, setPollensLoading] = useState(false);

  useEffect(() => {
    if (step === 4) {
      loadPollens();
    }
  }, [step]);

  const loadPollens = async () => {
    setPollensLoading(true);
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

  const handleNext = () => {
    if (step === 1) {
      if (!name || !email || !password || !passwordConfirmation) {
        Alert.alert('Blad', 'Wypelnij wszystkie pola.');
        return;
      }
      if (password !== passwordConfirmation) {
        Alert.alert('Blad', 'Hasla nie sa identyczne.');
        return;
      }
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data: RegisterData = {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      };
      if (region) data.region = region;
      if (dateOfBirth) data.date_of_birth = dateOfBirth;
      if (weight) data.weight = parseFloat(weight);
      if (height) data.height = parseInt(height, 10);
      if (selectedAllergens.length > 0) data.allergen_ids = selectedAllergens;

      await register(data);
      router.replace('/(tabs)');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Blad rejestracji.';
      Alert.alert('Blad', message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4].map((s) => (
        <View
          key={s}
          style={[styles.stepDot, s === step && styles.stepDotActive, s < step && styles.stepDotDone]}
        />
      ))}
    </View>
  );

  const renderStep1 = () => (
    <>
      <Text style={styles.subtitle}>Utworz konto</Text>
      <TextInput style={styles.input} placeholder="Imie" value={name} onChangeText={setName} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Haslo"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Potwierdz haslo"
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Dalej</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Masz juz konto? Zaloguj sie</Text>
      </TouchableOpacity>
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={styles.subtitle}>Wybierz swoj region</Text>
      <Text style={styles.hint}>Kliknij na mapie swoje wojewodztwo</Text>
      <PolandMap selected={region} onSelect={setRegion} />
      <TouchableOpacity style={[styles.button, !region && styles.buttonMuted]} onPress={handleNext}>
        <Text style={styles.buttonText}>{region ? 'Dalej' : 'Pomin'}</Text>
      </TouchableOpacity>
    </>
  );

  const renderStep3 = () => (
    <>
      <Text style={styles.subtitle}>Profil zdrowotny (opcjonalne)</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Dalej</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNext}>
        <Text style={styles.link}>Pomin</Text>
      </TouchableOpacity>
    </>
  );

  const renderStep4 = () => (
    <>
      <Text style={styles.subtitle}>Wybierz alergeny (opcjonalne)</Text>
      {pollensLoading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={{ marginVertical: 24 }} />
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
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Rejestracja...' : 'Zarejestruj sie'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSubmit} disabled={loading}>
        <Text style={styles.link}>Pomin</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>🌿 Spora</Text>
        {renderStepIndicator()}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  inner: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4CAF50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
  },
  hint: {
    fontSize: 13,
    textAlign: 'center',
    color: '#999',
    marginBottom: 12,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ddd',
  },
  stepDotActive: {
    backgroundColor: '#4CAF50',
  },
  stepDotDone: {
    backgroundColor: '#81C784',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonMuted: {
    backgroundColor: '#A5D6A7',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
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
  },
});
