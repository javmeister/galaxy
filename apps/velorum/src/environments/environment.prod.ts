export const environment = {
  name: 'Production',
  production: true,
  log: {
    level: 4,
    date: false,
  },
  cdn: {
    host: 'cdn.velorum.games',
    path: 'singularity',
    map: {
      stars: 'velorum/stars-compressed.json',
      colors: 'velorum/stars-colors.json',
      names: 'velorum/star-names.json',
    },
    vcom: {
      lore: 'vcom/lore',
      speaker: {
        images: 'vcom/speaker',
        audio: 'vcom/speaker/audio'
      }
    },
    game: {
      sectors: 'galaxy/sectors-meco.json',
      systems: 'galaxy/solar-systems-meco.json',
      celestials: 'galaxy/celestials.json',
      structures: 'galaxy/structures.json',
      colors: 'galaxy/colors.json'
    }
  }
};
