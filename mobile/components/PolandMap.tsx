import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PATHS from './polandPaths';

const GREEN = '#4CAF50';

const VOIVODESHIP_IDS = Object.keys(PATHS);

const REGION_NAMES: Record<string, string> = {
  'dolnoslaskie': 'Dolnośląskie',
  'kujawsko-pomorskie': 'Kujawsko-pomorskie',
  'lubelskie': 'Lubelskie',
  'lubuskie': 'Lubuskie',
  'lodzkie': 'Łódzkie',
  'malopolskie': 'Małopolskie',
  'mazowieckie': 'Mazowieckie',
  'opolskie': 'Opolskie',
  'podkarpackie': 'Podkarpackie',
  'podlaskie': 'Podlaskie',
  'pomorskie': 'Pomorskie',
  'slaskie': 'Śląskie',
  'swietokrzyskie': 'Świętokrzyskie',
  'warminsko-mazurskie': 'Warmińsko-mazurskie',
  'wielkopolskie': 'Wielkopolskie',
  'zachodniopomorskie': 'Zachodniopomorskie',
};

interface PolandMapProps {
  selected: string | null;
  onSelect: (region: string) => void;
}

export default function PolandMap({ selected, onSelect }: PolandMapProps) {
  return (
    <View style={s.container}>
      <Svg viewBox="0 0 1000 947" style={s.svg}>
        {VOIVODESHIP_IDS.map((id) => {
          const isSelected = selected === id;
          return (
            <Path
              key={id}
              d={PATHS[id]}
              fill={isSelected ? GREEN : '#E8F5E9'}
              stroke={isSelected ? '#2E7D32' : '#81C784'}
              strokeWidth={isSelected ? 3 : 1.5}
              strokeLinejoin="round"
              strokeLinecap="round"
              onPress={() => onSelect(id)}
            />
          );
        })}
      </Svg>
      {selected && (
        <View style={s.selectedContainer}>
          <Text style={s.selectedLabel}>Wybrany region:</Text>
          <Text style={s.selectedValue}>{REGION_NAMES[selected] || selected}</Text>
        </View>
      )}
    </View>
  );
}

export { REGION_NAMES };

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 8,
  },
  svg: {
    width: '100%',
    aspectRatio: 1000 / 947,
  },
  selectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
    gap: 6,
  },
  selectedLabel: {
    fontSize: 14,
    color: '#555',
  },
  selectedValue: {
    fontSize: 15,
    fontWeight: '700',
    color: GREEN,
  },
});
