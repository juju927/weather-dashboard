export const TEMPERATURE_LEVELS = [
  {
    name: "ice cold",
    max: 0,
    color: "blue-600",
    description: "f-f-f-freez-i-i-ng",
  },
  {
    name: "very cold",
    max: 10,
    color: "blue-500",
    description: "kinda cold",
  },
  {
    name: "cold",
    max: 15,
    color: "blue-300",
    description: "better bring jacket",
  },
  {
    name: "cool",
    max: 22,
    color: "blue-100",
    description: "weather good ah",
  },
  {
    name: "warm",
    max: 28,
    color: "red-100",
    description: "weather not bad hor",
  },
  {
    name: "hot",
    max: 33,
    color: "red-300",
    description: "very hot",
  },
  {
    name: "very hot",
    max: 38,
    color: "red-500",
    description: "DAAAAAAMN HOT",
  },
  {
    name: "hell",
    max: Infinity,
    color: "red-600",
    description: "confirm diedie",
  },
];


export const getTempConfig = (temp) => {
    return TEMPERATURE_LEVELS.find(band => temp <= band.max);
};
