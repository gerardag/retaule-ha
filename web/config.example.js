// Copia aquest fitxer a ../config.js (al costat de docker-compose.yml) i adapta'l.
// Qualsevol entitat que no tinguis, esborra-la: la pantalla amaga la dada o l'avís que en depèn.
window.PANTALLA_CONFIG = {
  // Token d'accés de llarga durada d'un usuari de HA sense administrador (vegeu el README).
  token: 'ENGANXA-AQUI-EL-TOKEN',

  name: 'Casa',            // títol de la pestanya
  roomName: 'Menjador',    // habitació on hi ha el termòstat

  entities: {
    // Exterior
    extTemp: 'sensor.exterior_temperatura',
    extHum: 'sensor.exterior_humitat',
    rainRate: 'sensor.pluja_intensitat',   // mm/h ara mateix
    rain1h: 'sensor.pluja_1h',             // mm de l'última hora
    rain24h: 'sensor.pluja_24h',
    wind: 'sensor.vent',
    gust: 'sensor.vent_ratxa',
    uv: 'sensor.uv',
    solar: 'sensor.radiacio_solar',
    lightningDist: 'sensor.blitzortung_lightning_distance',
    lightningCount: 'sensor.blitzortung_lightning_counter',

    // Interior i calefacció
    intTemp: 'sensor.menjador_temperatura',
    climate: 'climate.menjador',
    heating: 'sensor.menjador_calefaccio', // % de demanda de calefacció (p. ex. Tado)

    // Energia
    power: 'sensor.consum',                // W ara mateix
    energy: 'sensor.energia',              // kWh acumulats (per a la gràfica i els €)
    discount: 'binary_sensor.llum_barata', // opcional: si no hi és, es fa servir l'horari de la franja (discount)
    servers: null,

    // Electrodomèstics: input_boolean que està "on" mentre funcionen
    dishwasher: 'input_boolean.rentaplats',
    washer: 'input_boolean.rentadora',
    dishCount: null,
    washCount: null,

    // Casa
    openings: 'binary_sensor.portes_i_finestres', // grup amb tots els sensors de portes i finestres
    alarm: 'alarm_control_panel.casa',
  },

  // Franja de llum barata; esborra-ho si no en tens. El preu del kWh surt del panell d'energia de HA.
  discount: { from: 12, to: 18, percent: 45 },

  // La zona dona color al nom; el mateix color a llums, persianes i portes.
  lights: [
    { entity: 'light.sofa', zone: 'Menjador', name: 'Làmpara sofà' },
    { entity: 'light.entrada', zone: 'Entrada', name: 'Entrada' },
  ],
  scenes: [
    { name: 'Relax', entity: 'scene.relax' },
  ],
  // floor és opcional: amb plantes, surten botons per pujar i baixar les persianes de cada planta.
  covers: [
    { entity: 'cover.persiana_menjador', name: 'Persiana', zone: 'Menjador', floor: 'Planta 0' },
  ],
  // Sensors de portes i finestres per al panell. Si no hi és, surten els del grup entities.openings.
  openings: [
    { entity: 'binary_sensor.porta_entrada', name: 'Porta', zone: 'Entrada' },
  ],
  // Només surten quan sonen, estan en pausa o engegats.
  media: [
    { entity: 'media_player.televisio', name: 'Televisió' },
  ],
  calendars: [
    { entity: 'calendar.personal', name: 'Personal' },
  ],
};
