// Типы настроек доз для стоматологического рентгена

export interface IntraoralDoseSettings {
  anteriorTeeth: number; // Передние зубы (резцы + клыки)
  premolars: number; // Премоляры
  upperMolars: number; // Моляры верхние
  lowerMolars: number; // Моляры нижние
}

export interface PanoramicDoseSettings {
  children: number; // Дети (до 14 лет)
  slim: number; // Худощавые
  average: number; // Средние
  heavy: number; // Тучные
}

export interface CBCTSegment {
  name: string;
  description: string;
}

export interface CBCTDoseSettings {
  children: {
    singleJaw: number; // Одна челюсть
    bothJaws: number; // Обе челюсти
    fullHead: number; // Полная голова
  };
  slim: {
    singleJaw: number;
    bothJaws: number;
    fullHead: number;
  };
  average: {
    singleJaw: number;
    bothJaws: number;
    fullHead: number;
  };
  heavy: {
    singleJaw: number;
    bothJaws: number;
    fullHead: number;
  };
}

export interface DoseSettings {
  intraoral: IntraoralDoseSettings;
  panoramic: PanoramicDoseSettings;
  cbct: CBCTDoseSettings;
}

// Значения по умолчанию (типичные дозы в мЗв)
export const defaultDoseSettings: DoseSettings = {
  intraoral: {
    anteriorTeeth: 0.003, // 3 мкЗв
    premolars: 0.004, // 4 мкЗв
    upperMolars: 0.005, // 5 мкЗв
    lowerMolars: 0.004, // 4 мкЗв
  },
  panoramic: {
    children: 0.008, // 8 мкЗв
    slim: 0.010, // 10 мкЗв
    average: 0.014, // 14 мкЗв
    heavy: 0.018, // 18 мкЗв
  },
  cbct: {
    children: {
      singleJaw: 0.060, // 60 мкЗв
      bothJaws: 0.100, // 100 мкЗв
      fullHead: 0.150, // 150 мкЗв
    },
    slim: {
      singleJaw: 0.080, // 80 мкЗв
      bothJaws: 0.130, // 130 мкЗв
      fullHead: 0.200, // 200 мкЗв
    },
    average: {
      singleJaw: 0.100, // 100 мкЗв
      bothJaws: 0.180, // 180 мкЗв
      fullHead: 0.280, // 280 мкЗв
    },
    heavy: {
      singleJaw: 0.130, // 130 мкЗв
      bothJaws: 0.220, // 220 мкЗв
      fullHead: 0.350, // 350 мкЗв
    },
  },
};

export const toothGroups = {
  anteriorUpper: ['11', '12', '13', '21', '22', '23'],
  anteriorLower: ['31', '32', '33', '41', '42', '43'],
  premolarsUpper: ['14', '15', '24', '25'],
  premolarsLower: ['34', '35', '44', '45'],
  molarsUpper: ['16', '17', '18', '26', '27', '28'],
  molarsLower: ['36', '37', '38', '46', '47', '48'],
};
