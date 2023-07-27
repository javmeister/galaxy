
const friendlyClass = (starClass?: string): string => {
  if (!starClass) return '';

  switch (starClass) {
    case '0':
      return 'G-Type (G2)';
    case '1':
      return 'Red Dwarf';
    case '2':
      return 'Red Giant';
    case '3':
      return 'Blue Giant';
    case '4':
      return 'Supergiant';
    case '5':
      return 'White Dwarf';
    case '6':
      return 'Pulsar';
    case '7':
      return 'Neutron Star';

    default:
      return 'Unknown';
      break;
  }
}

const singleClassId = (starClass?: string): string => {
  if (!starClass) return '';

  let friendly = friendlyClass(starClass);

  friendly = friendly.toLowerCase().replace(' ', '');

  return friendly;
}

const binaryClassId = (aClass?: string, bClass?: string): string => {
  let friendlya = friendlyClass(aClass);
  let friendlyb = friendlyClass(bClass);

  friendlya = friendlya.toLowerCase().replace(' ', '');
  friendlyb = friendlyb.toLowerCase().replace(' ', '');

  let classId = '';

  switch(friendlya) {
    case 'mainsequence': classId = 'ms'; break;
    case 'whitedwarf': classId = 'wd'; break;
    case 'pulsar': classId = 'psr'; break;
    case 'neutronstar': classId = 'ns'; break;
  }

  switch(friendlyb) {
    case 'mainsequence': classId += 'ms'; break;
    case 'redwarf': classId += 'rd'; break;
    case 'whitedwarf': classId += 'wd'; break;
    case 'pulsar': classId += 'psr'; break;
    case 'neutronstar': classId += 'ns'; break;
  }

  return classId;
}


export { friendlyClass, singleClassId, binaryClassId }
