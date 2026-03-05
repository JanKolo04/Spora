import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4CAF50',
        headerStyle: { backgroundColor: '#4CAF50' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Pyłki',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🌿</Text>,
          headerTitle: 'Spora - Pyłki',
        }}
      />
      <Tabs.Screen
        name="wellness"
        options={{
          title: 'Samopoczucie',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📅</Text>,
          headerTitle: 'Kalendarz samopoczucia',
        }}
      />
      <Tabs.Screen
        name="medications"
        options={{
          title: 'Leki',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>💊</Text>,
          headerTitle: 'Przypomnienia o lekach',
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Raporty',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📋</Text>,
          headerTitle: 'Raporty objawów',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>👤</Text>,
        }}
      />
    </Tabs>
  );
}
