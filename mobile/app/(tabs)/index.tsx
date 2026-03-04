import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { pollenApi, Pollen } from '../../services/api';

const levelColors: Record<string, string> = {
  'niski': '#4CAF50',
  'średni': '#FFC107',
  'wysoki': '#FF9800',
  'bardzo wysoki': '#F44336',
};

export default function PollenListScreen() {
  const [pollens, setPollens] = useState<Pollen[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPollens = useCallback(async () => {
    try {
      const response = await pollenApi.getAll();
      setPollens(response.data.data);
    } catch (error) {
      console.error('Error fetching pollens:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPollens();
  }, [fetchPollens]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPollens();
  }, [fetchPollens]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const renderPollen = ({ item }: { item: Pollen }) => {
    const level = item.latest_reading?.level;
    const borderColor = level ? levelColors[level] || '#ccc' : '#ccc';

    return (
      <TouchableOpacity
        style={[styles.card, { borderLeftColor: borderColor, borderLeftWidth: 4 }]}
        onPress={() => router.push(`/pollen/${item.id}`)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.icon}>{item.icon}</Text>
          <Text style={styles.name}>{item.name}</Text>
        </View>
        {item.latest_reading ? (
          <View style={styles.readingInfo}>
            <Text style={styles.concentration}>
              {item.latest_reading.concentration} ziaren/m³
            </Text>
            <View style={[styles.levelBadge, { backgroundColor: borderColor }]}>
              <Text style={styles.levelText}>{item.latest_reading.level}</Text>
            </View>
            <Text style={styles.region}>{item.latest_reading.region}</Text>
          </View>
        ) : (
          <Text style={styles.noData}>Brak danych</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={pollens}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderPollen}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4CAF50']} />
      }
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.emptyText}>Brak danych o pyłkach</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  readingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  concentration: {
    fontSize: 14,
    color: '#666',
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
  region: {
    fontSize: 12,
    color: '#999',
  },
  noData: {
    color: '#999',
    fontSize: 14,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
});
