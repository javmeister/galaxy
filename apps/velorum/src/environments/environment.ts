export const environment = {
  name: 'Dev',
  production: false,
  log: {
    level: 1,
    date: false,
  },
  cdn: {
    host: 'cdn.velorum.games',
    path: 'dev',
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
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error'; // Included with Angular CLI.
