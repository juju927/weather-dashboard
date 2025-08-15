export const TEMPERATURE_LEVELS = [
  {
    name: "ice cold",
    max: 0,
    color: "from-blue-600",
    description: "f-f-f-freez-i-i-ng",
  },
  {
    name: "very cold",
    max: 10,
    color: "from-blue-500",
    description: "kinda cold",
  },
  {
    name: "cold",
    max: 15,
    color: "from-blue-300",
    description: "better bring jacket",
  },
  {
    name: "cool",
    max: 22,
    color: "from-blue-200",
    description: "weather good ah",
  },
  {
    name: "warm",
    max: 28,
    color: "from-red-200",
    description: "weather not bad hor",
  },
  {
    name: "hot",
    max: 33,
    color: "from-red-300",
    description: "very hot",
  },
  {
    name: "very hot",
    max: 40,
    color: "from-red-500",
    description: "DAAAAAAMN HOT",
  },
  {
    name: "hell",
    max: Infinity,
    color: "from-red-600",
    description: "confirm die",
  },
];


export const getTempConfig = (temp) => {
    return TEMPERATURE_LEVELS.find(band => temp <= band.max);
};
