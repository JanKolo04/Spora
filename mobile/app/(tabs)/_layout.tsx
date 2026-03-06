import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GREEN = '#4CAF50';
const GREEN_DARK = '#388E3C';
const INACTIVE = '#A5D6A7';
const TAB_BG = '#FFFFFF';

type IoniconsName = keyof typeof Ionicons.glyphMap;

function TabIcon({ name, color, size, isHome }: { name: IoniconsName; color: string; size: number; isHome?: boolean }) {
  if (isHome) {
    return (
      <View style={styles.homeIconWrapper}>
        <View style={[styles.homeIconCircle, color === GREEN ? styles.homeIconActive : null]}>
          <Ionicons name={name} size={size + 4} color="#fff" />
        </View>
      </View>
    );
  }
  return <Ionicons name={name} size={size} color={color} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: GREEN,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        headerStyle: styles.header,
        headerTintColor: '#fff',
        headerTitleStyle: styles.headerTitle,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="wellness"
        options={{
          title: 'Zdrowie',
          headerTitle: 'Kalendarz samopoczucia',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? 'calendar' : 'calendar-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="medications"
        options={{
          title: 'Leki',
          headerTitle: 'Przypomnienia o lekach',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? 'medkit' : 'medkit-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Pylki',
          headerTitle: 'Spora',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? 'leaf' : 'leaf-outline'} color={color} size={size} isHome />
          ),
          tabBarLabelStyle: styles.homeLabel,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Raporty',
          headerTitle: 'Raporty objawow',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? 'document-text' : 'document-text-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          headerTitle: 'Twoj profil',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? 'person-circle' : 'person-circle-outline'} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: TAB_BG,
    borderTopWidth: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  homeLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 6,
  },
  tabBarItem: {
    paddingTop: 4,
  },
  header: {
    backgroundColor: GREEN,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitle: {
    fontWeight: '800',
    fontSize: 18,
    letterSpacing: 0.3,
  },
  homeIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -14,
  },
  homeIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: INACTIVE,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: GREEN_DARK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  homeIconActive: {
    backgroundColor: GREEN,
  },
});
