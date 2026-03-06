import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

const GREEN = '#4CAF50';

const VOIVODESHIPS: { id: string; name: string; d: string; labelX: number; labelY: number }[] = [
  {
    id: 'zachodniopomorskie',
    name: 'zachodniopomorskie',
    d: 'M95,30 L130,20 L155,35 L170,30 L175,55 L165,80 L175,105 L155,115 L130,105 L110,115 L90,105 L80,80 L75,55 Z',
    labelX: 125, labelY: 70,
  },
  {
    id: 'pomorskie',
    name: 'pomorskie',
    d: 'M170,30 L200,15 L235,10 L260,20 L270,45 L265,75 L250,90 L225,85 L200,95 L175,105 L165,80 L175,55 Z',
    labelX: 220, labelY: 55,
  },
  {
    id: 'warminsko-mazurskie',
    name: 'warm.-mazurskie',
    d: 'M270,45 L260,20 L290,15 L330,10 L365,20 L375,50 L365,80 L340,90 L310,85 L280,90 L265,75 Z',
    labelX: 320, labelY: 52,
  },
  {
    id: 'podlaskie',
    name: 'podlaskie',
    d: 'M365,80 L375,50 L395,65 L400,100 L395,140 L385,170 L365,175 L345,155 L335,125 L340,90 Z',
    labelX: 370, labelY: 120,
  },
  {
    id: 'lubuskie',
    name: 'lubuskie',
    d: 'M55,115 L90,105 L110,115 L130,105 L135,135 L125,165 L110,185 L85,190 L65,175 L50,150 Z',
    labelX: 92, labelY: 148,
  },
  {
    id: 'wielkopolskie',
    name: 'wielkopolskie',
    d: 'M130,105 L155,115 L175,105 L200,95 L215,115 L220,145 L210,175 L195,195 L170,200 L145,195 L125,180 L125,165 L135,135 Z',
    labelX: 172, labelY: 150,
  },
  {
    id: 'kujawsko-pomorskie',
    name: 'kuj.-pomorskie',
    d: 'M200,95 L225,85 L250,90 L280,90 L290,110 L285,135 L270,150 L245,150 L220,145 L215,115 Z',
    labelX: 250, labelY: 120,
  },
  {
    id: 'mazowieckie',
    name: 'mazowieckie',
    d: 'M280,90 L310,85 L335,125 L345,155 L365,175 L355,200 L340,215 L310,220 L280,210 L260,195 L255,170 L270,150 L285,135 L290,110 Z',
    labelX: 310, labelY: 160,
  },
  {
    id: 'lodzkie',
    name: 'lodzkie',
    d: 'M220,145 L245,150 L270,150 L255,170 L260,195 L250,215 L225,225 L200,215 L195,195 L210,175 Z',
    labelX: 230, labelY: 188,
  },
  {
    id: 'lubelskie',
    name: 'lubelskie',
    d: 'M340,215 L355,200 L365,175 L385,170 L395,195 L390,235 L380,265 L355,275 L330,265 L315,245 L310,220 Z',
    labelX: 355, labelY: 228,
  },
  {
    id: 'dolnoslaskie',
    name: 'dolnoslaskie',
    d: 'M65,175 L85,190 L110,185 L125,180 L145,195 L150,220 L140,250 L120,265 L95,260 L70,245 L55,220 L50,195 Z',
    labelX: 100, labelY: 222,
  },
  {
    id: 'opolskie',
    name: 'opolskie',
    d: 'M145,195 L170,200 L185,220 L180,250 L160,265 L140,260 L140,250 L150,220 Z',
    labelX: 162, labelY: 232,
  },
  {
    id: 'slaskie',
    name: 'slaskie',
    d: 'M170,200 L195,195 L200,215 L210,240 L200,265 L180,275 L160,265 L180,250 L185,220 Z',
    labelX: 188, labelY: 240,
  },
  {
    id: 'swietokrzyskie',
    name: 'swietokrzyskie',
    d: 'M250,215 L260,195 L280,210 L310,220 L315,245 L295,255 L270,250 L255,240 Z',
    labelX: 280, labelY: 232,
  },
  {
    id: 'malopolskie',
    name: 'malopolskie',
    d: 'M200,265 L210,240 L255,240 L270,250 L295,255 L290,280 L265,295 L235,300 L210,290 Z',
    labelX: 248, labelY: 275,
  },
  {
    id: 'podkarpackie',
    name: 'podkarpackie',
    d: 'M295,255 L315,245 L330,265 L355,275 L365,295 L345,310 L315,315 L290,305 L265,295 L290,280 Z',
    labelX: 325, labelY: 285,
  },
];

interface PolandMapProps {
  selected: string | null;
  onSelect: (region: string) => void;
}

export default function PolandMap({ selected, onSelect }: PolandMapProps) {
  return (
    <View style={s.container}>
      <Svg viewBox="30 0 400 330" style={s.svg}>
        <G>
          {VOIVODESHIPS.map((v) => {
            const isSelected = selected === v.id;
            return (
              <Path
                key={v.id}
                d={v.d}
                fill={isSelected ? GREEN : '#E8F5E9'}
                stroke={isSelected ? '#2E7D32' : '#A5D6A7'}
                strokeWidth={isSelected ? 2.5 : 1.5}
                onPress={() => onSelect(v.id)}
              />
            );
          })}
        </G>
      </Svg>
      <View style={s.labelsContainer}>
        <Svg viewBox="30 0 400 330" style={s.labelsSvg}>
          {VOIVODESHIPS.map((v) => {
            const isSelected = selected === v.id;
            return (
              <G key={v.id} onPress={() => onSelect(v.id)}>
                <Path
                  d={`M${v.labelX - 28},${v.labelY - 6} h56 a4,4 0 0 1 4,4 v12 a4,4 0 0 1 -4,4 h-56 a4,4 0 0 1 -4,-4 v-12 a4,4 0 0 1 4,-4 z`}
                  fill={isSelected ? '#2E7D32' : 'rgba(255,255,255,0.85)'}
                  stroke={isSelected ? '#1B5E20' : '#A5D6A7'}
                  strokeWidth={0.5}
                />
              </G>
            );
          })}
        </Svg>
      </View>
      {selected && (
        <View style={s.selectedContainer}>
          <Text style={s.selectedLabel}>Wybrany region:</Text>
          <Text style={s.selectedValue}>{formatRegionName(selected)}</Text>
        </View>
      )}
    </View>
  );
}

function formatRegionName(id: string): string {
  const names: Record<string, string> = {
    'zachodniopomorskie': 'Zachodniopomorskie',
    'pomorskie': 'Pomorskie',
    'warminsko-mazurskie': 'Warmińsko-mazurskie',
    'podlaskie': 'Podlaskie',
    'lubuskie': 'Lubuskie',
    'wielkopolskie': 'Wielkopolskie',
    'kujawsko-pomorskie': 'Kujawsko-pomorskie',
    'mazowieckie': 'Mazowieckie',
    'lodzkie': 'Łódzkie',
    'lubelskie': 'Lubelskie',
    'dolnoslaskie': 'Dolnośląskie',
    'opolskie': 'Opolskie',
    'slaskie': 'Śląskie',
    'swietokrzyskie': 'Świętokrzyskie',
    'malopolskie': 'Małopolskie',
    'podkarpackie': 'Podkarpackie',
  };
  return names[id] || id;
}

export { formatRegionName, VOIVODESHIPS };

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 8,
  },
  svg: {
    width: '100%',
    aspectRatio: 1.3,
  },
  labelsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  labelsSvg: {
    width: '100%',
    aspectRatio: 1.3,
  },
  selectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 8,
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
