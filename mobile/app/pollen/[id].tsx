import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { pollenApi, PollenDetail, PollenReading } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const levelColors: Record<string, string> = {
  'niski': '#4CAF50',
  'średni': '#FFC107',
  'wysoki': '#FF9800',
  'bardzo wysoki': '#F44336',
};

export default function PollenDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [pollen, setPollen] = useState<PollenDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPollen = async () => {
      try {
        const response = await pollenApi.getById(Number(id), user?.region || undefined);
        setPollen(response.data.data);
      } catch (error) {
        console.error('Error fetching pollen details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPollen();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!pollen) {
    return (
      <View style={styles.center}>
        <Text>Nie znaleziono danych</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: `${pollen.icon} ${pollen.name}`,
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
          headerBackTitle: '',
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.icon}>{pollen.icon}</Text>
          <Text style={styles.title}>{pollen.name}</Text>
        </View>

        {pollen.description && (
          <View style={styles.section}>
            <Text style={styles.description}>{pollen.description}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historia odczytów</Text>
          {pollen.readings.length === 0 ? (
            <Text style={styles.noData}>Brak odczytów</Text>
          ) : (
            pollen.readings.map((reading: PollenReading, index: number) => {
              const color = levelColors[reading.level] || '#ccc';
              return (
                <View
                  key={reading.id || index}
                  style={[styles.readingCard, { borderLeftColor: color, borderLeftWidth: 4 }]}
                >
                  <View style={styles.readingHeader}>
                    <Text style={styles.readingDate}>{reading.reading_date}</Text>
                    <View style={[styles.levelBadge, { backgroundColor: color }]}>
                      <Text style={styles.levelText}>{reading.level}</Text>
                    </View>
                  </View>
                  <Text style={styles.readingConcentration}>
                    {reading.concentration} ziaren/m³
                  </Text>
                  <Text style={styles.readingRegion}>{reading.region}</Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  icon: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    padding: 16,
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  noData: {
    color: '#999',
    fontSize: 14,
  },
  readingCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  readingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  readingDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  levelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  readingConcentration: {
    fontSize: 13,
    color: '#666',
  },
  readingRegion: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
});
