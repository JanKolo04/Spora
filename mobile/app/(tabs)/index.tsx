import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { dashboardApi, pollenApi, Pollen, DashboardData } from '../../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GREEN = '#4CAF50';
const GREEN_DARK = '#388E3C';

const levelColors: Record<string, string> = {
  'niski': '#4CAF50',
  'średni': '#FFC107',
  'wysoki': '#FF9800',
  'bardzo wysoki': '#F44336',
};

const levelLabels: Record<string, string> = {
  'niski': 'Niski',
  'średni': 'Sredni',
  'wysoki': 'Wysoki',
  'bardzo wysoki': 'B. wysoki',
};

function AnimatedBar({ width, color, delay }: { width: number; color: string; delay: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: width, duration: 800, delay, useNativeDriver: false }).start();
  }, [width]);
  return (
    <Animated.View style={{ height: 8, borderRadius: 4, backgroundColor: color, width: anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }} />
  );
}

function MiniBarChart({ data }: { data: DashboardData['last_7_days'] }) {
  const maxCount = Math.max(...data.map(d => d.avg_concentration), 1);
  return (
    <View style={s.chartRow}>
      {data.map((day, i) => {
        const h = Math.max((day.avg_concentration / maxCount) * 80, 4);
        return (
          <View key={i} style={s.chartCol}>
            <View style={[s.chartBar, { height: h, backgroundColor: day.avg_concentration > 0 ? GREEN : '#E0E0E0' }]} />
            <Text style={s.chartLabel}>{day.date}</Text>
          </View>
        );
      })}
    </View>
  );
}

export default function HomeScreen() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [pollens, setPollens] = useState<Pollen[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchData = useCallback(async () => {
    try {
      const [dashRes, pollenRes] = await Promise.all([
        dashboardApi.get(),
        pollenApi.getAll(),
      ]);
      setDashboard(dashRes.data.data);
      setPollens(pollenRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }
  }, [loading]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={GREEN} />
      </View>
    );
  }

  const totalLevels = dashboard ? Object.values(dashboard.level_distribution).reduce((a, b) => a + b, 0) : 0;

  const pollensWithReadings = pollens.filter(p => p.latest_reading);
  const highCount = pollensWithReadings.filter(p => p.latest_reading?.level === 'wysoki' || p.latest_reading?.level === 'bardzo wysoki').length;

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[GREEN]} />}
      >
        {/* Hero */}
        <View style={s.hero}>
          <Text style={s.heroTitle}>Witaj w Spora</Text>
          <Text style={s.heroSub}>
            {highCount > 0
              ? `${highCount} ${highCount === 1 ? 'pylek' : 'pylkow'} z wysokim stezeniem`
              : 'Wszystkie stezenia w normie'}
          </Text>
        </View>

        {/* Stat cards */}
        {dashboard && (
          <View style={s.statsRow}>
            <View style={[s.statCard, { backgroundColor: GREEN }]}>
              <Text style={s.statValue}>{dashboard.pollens_count}</Text>
              <Text style={s.statLabel}>Pylki</Text>
            </View>
            <View style={[s.statCard, { backgroundColor: '#2196F3' }]}>
              <Text style={s.statValue}>{dashboard.readings_count}</Text>
              <Text style={s.statLabel}>Odczyty</Text>
            </View>
            <View style={[s.statCard, { backgroundColor: '#FF9800' }]}>
              <Text style={s.statValue}>{dashboard.today_readings_count}</Text>
              <Text style={s.statLabel}>Dzisiaj</Text>
            </View>
          </View>
        )}

        {/* Level distribution */}
        {dashboard && totalLevels > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Rozklad poziomow</Text>
            <View style={s.card}>
              {(['niski', 'średni', 'wysoki', 'bardzo wysoki'] as const).map((level, i) => {
                const count = dashboard.level_distribution[level] || 0;
                const pct = totalLevels > 0 ? (count / totalLevels) * 100 : 0;
                return (
                  <View key={level} style={s.levelRow}>
                    <View style={s.levelLabelWrap}>
                      <View style={[s.levelDot, { backgroundColor: levelColors[level] }]} />
                      <Text style={s.levelLabel}>{levelLabels[level]}</Text>
                    </View>
                    <View style={s.levelBarBg}>
                      <AnimatedBar width={pct} color={levelColors[level]} delay={i * 100} />
                    </View>
                    <Text style={s.levelCount}>{count}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Weekly chart */}
        {dashboard && dashboard.last_7_days.some(d => d.avg_concentration > 0) && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Stezenie (7 dni)</Text>
            <View style={s.card}>
              <MiniBarChart data={dashboard.last_7_days} />
              <Text style={s.chartUnit}>Srednie stezenie ziaren/m³</Text>
            </View>
          </View>
        )}

        {/* Top pollens */}
        {dashboard && dashboard.top_pollens.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Najbardziej pylace</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {dashboard.top_pollens.map((p, i) => (
                <TouchableOpacity key={p.id} style={s.topCard} onPress={() => router.push(`/pollen/${p.id}`)}>
                  {i === 0 && <Text style={s.crown}>👑</Text>}
                  <Text style={s.topIcon}>{p.icon}</Text>
                  <Text style={s.topName}>{p.name}</Text>
                  <Text style={s.topCount}>{p.readings_count} odc.</Text>
                  {p.latest_level && (
                    <View style={[s.topBadge, { backgroundColor: levelColors[p.latest_level] || '#ccc' }]}>
                      <Text style={s.topBadgeText}>{p.latest_level}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* High alerts */}
        {dashboard && dashboard.high_alerts.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Alerty</Text>
            {dashboard.high_alerts.map((a, i) => (
              <View key={i} style={[s.alertCard, { borderLeftColor: levelColors[a.level] || '#F44336' }]}>
                <Text style={s.alertIcon}>{a.pollen_icon}</Text>
                <View style={s.alertInfo}>
                  <Text style={s.alertName}>{a.pollen_name}</Text>
                  <Text style={s.alertDetail}>{a.concentration} ziaren/m³ · {a.region}</Text>
                </View>
                <View style={[s.alertBadge, { backgroundColor: levelColors[a.level] }]}>
                  <Text style={s.alertBadgeText}>{a.level}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Pollen list */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Wszystkie pylki</Text>
          {pollens.length === 0 ? (
            <View style={s.card}>
              <Text style={s.empty}>Brak danych o pylkach</Text>
            </View>
          ) : (
            pollens.map(item => {
              const level = item.latest_reading?.level;
              const borderColor = level ? levelColors[level] || '#ccc' : '#E0E0E0';
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[s.pollenCard, { borderLeftColor: borderColor }]}
                  onPress={() => router.push(`/pollen/${item.id}`)}
                  activeOpacity={0.7}
                >
                  <View style={s.pollenHeader}>
                    <Text style={s.pollenIcon}>{item.icon}</Text>
                    <View style={s.pollenMeta}>
                      <Text style={s.pollenName}>{item.name}</Text>
                      {item.latest_reading ? (
                        <Text style={s.pollenConc}>{item.latest_reading.concentration} ziaren/m³ · {item.latest_reading.region}</Text>
                      ) : (
                        <Text style={s.pollenNoData}>Brak danych</Text>
                      )}
                    </View>
                    {level && (
                      <View style={[s.pollenBadge, { backgroundColor: borderColor }]}>
                        <Text style={s.pollenBadgeText}>{level}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { flex: 1, backgroundColor: '#F5F6F8' },
  scrollContent: { paddingBottom: 32 },

  hero: {
    backgroundColor: GREEN,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  heroTitle: { color: '#fff', fontSize: 24, fontWeight: '800' },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 4 },

  statsRow: { flexDirection: 'row', marginHorizontal: 16, marginTop: -16, gap: 10 },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  statValue: { color: '#fff', fontSize: 22, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '600', marginTop: 2 },

  section: { marginTop: 20, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#333', marginBottom: 10 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },

  levelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  levelLabelWrap: { flexDirection: 'row', alignItems: 'center', width: 80 },
  levelDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  levelLabel: { fontSize: 12, fontWeight: '600', color: '#555' },
  levelBarBg: { flex: 1, height: 8, borderRadius: 4, backgroundColor: '#F0F0F0', marginHorizontal: 8, overflow: 'hidden' },
  levelCount: { width: 28, textAlign: 'right', fontSize: 13, fontWeight: '700', color: '#333' },

  chartRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 100, gap: 6 },
  chartCol: { flex: 1, alignItems: 'center' },
  chartBar: { width: '100%', borderRadius: 4, minHeight: 4 },
  chartLabel: { fontSize: 10, color: '#888', marginTop: 6, fontWeight: '600' },
  chartUnit: { textAlign: 'center', fontSize: 11, color: '#999', marginTop: 10 },

  topCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginRight: 12,
    width: 110,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  crown: { fontSize: 14, position: 'absolute', top: 6, right: 6 },
  topIcon: { fontSize: 28, marginBottom: 6 },
  topName: { fontSize: 13, fontWeight: '700', color: '#333', textAlign: 'center' },
  topCount: { fontSize: 11, color: '#888', marginTop: 2 },
  topBadge: { marginTop: 6, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  topBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  alertIcon: { fontSize: 24, marginRight: 10 },
  alertInfo: { flex: 1 },
  alertName: { fontSize: 14, fontWeight: '700', color: '#333' },
  alertDetail: { fontSize: 11, color: '#888', marginTop: 2 },
  alertBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  alertBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  pollenCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  pollenHeader: { flexDirection: 'row', alignItems: 'center' },
  pollenIcon: { fontSize: 28, marginRight: 12 },
  pollenMeta: { flex: 1 },
  pollenName: { fontSize: 15, fontWeight: '700', color: '#333' },
  pollenConc: { fontSize: 12, color: '#888', marginTop: 2 },
  pollenNoData: { fontSize: 12, color: '#bbb', marginTop: 2 },
  pollenBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  pollenBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  empty: { textAlign: 'center', color: '#999', fontSize: 14 },
});
