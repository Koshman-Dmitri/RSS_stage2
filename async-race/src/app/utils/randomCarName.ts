const carName = [
  'Alfa Romeo',
  'Aston Martin',
  'AUDI',
  'BMW',
  'Bentley',
  'Buick',
  'Cadillac',
  'Chevrolet',
  'Chrysler',
  'Daewoo',
  'Dodge',
  'Ferrari',
  'Fiat',
  'Fisker',
  'Ford',
  'Honda',
  'Hummer',
  'Huyndai',
  'Infinity',
  'Jaguar',
  'KIA',
  'Lamborghini',
  'Land Rover',
  'Lexus',
  'Mazda',
  'Maserati',
  'Maybach',
  'McLaren',
  'Mercedes',
  'Mitsubishi',
  'Nissan',
  'Pontiac',
  'Porsche',
  'Rolls Royce',
  'Saab',
  'Subaru',
  'Tesla',
  'Toyota',
  'Volkswagen',
  'Volvo',
];

const carModel = [
  'Giulia',
  'DB9',
  'Q5',
  'M3',
  'Continental',
  'Escalade',
  'Lanos',
  'Matiz',
  'Challenger',
  'Spider',
  'Doblo',
  'Carma',
  'Transit',
  'Accord',
  'H3',
  'Solaris',
  'FX',
  'RIO',
  'Hurracan',
  'Sport',
  'IS300',
  'CX5',
  'Lancer',
  'Quashkai',
  'Cayene',
  'Model S',
  'Camry',
  'Jetta',
  'S60',
];

export const randomModel = () => {
  const name = carName[Math.floor(Math.random() * carName.length)];
  const model = carModel[Math.floor(Math.random() * carModel.length)];
  return `${name} ${model}`;
};