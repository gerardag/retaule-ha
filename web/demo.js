// Mode demo: estats inventats per provar la pantalla sense Home Assistant (?demo=<escenari>).
// Configuració de la demo: mateixa forma que config.js, amb entitats inventades.
window.PANTALLA_DEMO_CONFIG = {
  name: 'Retaule (demo)',
  roomName: 'Menjador',
  entities: {
    extTemp: 'sensor.exterior_temperatura', extHum: 'sensor.exterior_humitat',
    rain24h: 'sensor.pluja_24h', rain1h: 'sensor.pluja_1h', rainRate: 'sensor.pluja_intensitat',
    wind: 'sensor.vent', gust: 'sensor.vent_ratxa', uv: 'sensor.uv', solar: 'sensor.radiacio_solar', vpd: 'sensor.vpd',
    intTemp: 'sensor.menjador_temperatura', climate: 'climate.menjador', heating: 'sensor.menjador_calefaccio',
    discount: 'binary_sensor.llum_barata', power: 'sensor.consum', energy: 'sensor.energia', servers: 'sensor.servidors_consum',
    dishwasher: 'input_boolean.rentaplats', washer: 'input_boolean.rentadora', dishCount: 'counter.rentaplats_any', washCount: 'counter.rentadores_any',
    openings: 'binary_sensor.portes_i_finestres', alarm: 'alarm_control_panel.casa',
    lightningDist: 'sensor.llamps_distancia', lightningCount: 'sensor.llamps_comptador',
  },
  discount: { from: 12, to: 18, percent: 45 },
  lights: [
    { entity: 'light.lampara_sofa', zone: 'Menjador', name: 'Làmpara sofà' },
    { entity: 'light.lampareta_tv', zone: 'Menjador', name: 'Lampareta TV' },
    { entity: 'light.entrada_bola', zone: 'Entrada', name: 'Entrada' },
    { entity: 'light.tauleta_de_nit', zone: 'Habitació', name: 'Tauleta de nit' },
    { entity: 'light.llum_de_peu', zone: 'Estudi', name: 'Llum de peu' },
    { entity: 'light.lampareta_ceramica', zone: 'Estudi', name: 'Lampareta ceràmica' },
    { entity: 'light.escriptori', zone: 'Estudi', name: 'Escriptori' },
  ],
  scenes: [{ name: 'Relax', entity: 'scene.relax' }, { name: 'Anar a dormir', entity: 'scene.anar_a_dormir' }],
  covers: [
    { entity: 'cover.persiana_menjador', name: 'Persiana', zone: 'Menjador', floor: 'Planta 0' },
    { entity: 'cover.persiana_habitacio', name: 'Persiana', zone: 'Habitació', floor: 'Planta 1' },
    { entity: 'cover.persiana_porta_cuina', name: 'Porta cuina', zone: 'Cuina', floor: 'Planta 0' },
    { entity: 'cover.persiana_finestra_cuina', name: 'Finestra cuina', zone: 'Cuina', floor: 'Planta 0' },
  ],
  openings: [
    { entity: 'binary_sensor.porta_entrada', name: 'Porta', zone: 'Entrada' },
    { entity: 'binary_sensor.finestra_cuina', name: 'Finestra', zone: 'Cuina' },
    { entity: 'binary_sensor.finestra_habitacio', name: 'Finestra', zone: 'Habitació' },
  ],
  media: [
    { entity: 'media_player.televisio', name: 'Televisió' },
    { entity: 'media_player.sonos_sala', name: 'Sonos sala' },
    { entity: 'media_player.sonos_estudi', name: 'Sonos estudi' },
  ],
  calendars: [{ entity: 'calendar.personal', name: 'Personal' }, { entity: 'calendar.familia', name: 'Família' }],
};

window.PANTALLA_DEMO = function (name, app) {
  const SC = {
    descompte: '12:40', plats: '15:05', roba: '16:58', finestres: '19:20', sensor: '20:10',
    pluja: '10:15', tempesta: '17:40', nit: '23:30', agenda: '16:50',
  };
  const [hh, mm] = (SC[name] || SC.descompte).split(':').map(Number);
  const target = new Date(); target.setHours(hh, mm, 0, 0);
  app.setOffset(target - Date.now());
  const T = target.getTime() / 1000;
  const ago = min => T - min * 60;

  const E = {};
  const set = (id, s, a = {}, lcMin = 120) => { E[id] = { s: String(s), a, lc: ago(lcMin), lu: ago(lcMin) }; };
  const night = name === 'nit';
  set('sun.sun', night ? 'below_horizon' : 'above_horizon');
  set('sensor.exterior_temperatura', { descompte: 17, plats: 19, roba: 18, finestres: 11, sensor: 11, pluja: 13, tempesta: 16, nit: 9 }[name] ?? 15);
  set('sensor.exterior_humitat', name === 'pluja' ? 94 : 60);
  set('sensor.pluja_24h', name === 'pluja' ? 6.8 : 0);
  set('sensor.pluja_1h', name === 'pluja' ? 4.2 : 0);
  set('sensor.pluja_intensitat', name === 'pluja' ? 3.1 : 0);
  set('sensor.vent', 7);
  set('sensor.vent_ratxa', 15);
  set('sensor.uv', night ? 0 : 3);
  set('sensor.radiacio_solar', night ? 0 : 420);
  set('sensor.menjador_temperatura', name === 'finestres' ? 20.1 : 21.4);
  set('climate.menjador', 'heat', { temperature: 21 });
  set('sensor.menjador_calefaccio', name === 'finestres' ? 62 : name === 'sensor' ? 35 : 0);
  set('binary_sensor.llum_barata', ['descompte', 'plats', 'roba', 'tempesta'].includes(name) ? 'on' : 'off');
  set('sensor.consum', { descompte: 640, plats: 310, nit: 190 }[name] ?? 450);
  set('sensor.servidors_consum', 40);
  set('input_boolean.rentaplats', 'off', {}, name === 'plats' ? 12 : 600);
  set('input_boolean.rentadora', 'off', {}, name === 'roba' ? 16 : 600);
  set('counter.rentaplats_any', 214);
  set('counter.rentadores_any', 168);
  const ops = ['binary_sensor.finestra_cuina', 'binary_sensor.porta_entrada', 'binary_sensor.finestra_habitacio'];
  set('binary_sensor.finestra_cuina', name === 'finestres' ? 'on' : name === 'sensor' ? 'unavailable' : 'off', { friendly_name: 'Finestra cuina' }, name === 'finestres' ? 14 : 180);
  set('binary_sensor.porta_entrada', 'off', { friendly_name: 'Porta entrada' });
  set('binary_sensor.finestra_habitacio', 'off', { friendly_name: 'Finestra habitació' });
  set('binary_sensor.portes_i_finestres', name === 'finestres' ? 'on' : 'off', { entity_id: ops });
  set('alarm_control_panel.casa', night ? 'armed_night' : 'disarmed');
  set('sensor.llamps_distancia', name === 'tempesta' ? 8 : 30, {}, 3);
  set('sensor.llamps_comptador', name === 'tempesta' ? 40 : 0, {}, 3);
  set('sensor.vpd', 1.6);
  const lightsOn = ['light.lampara_sofa', 'light.lampareta_tv'];
  for (const id of ['light.lampara_sofa', 'light.lampareta_tv', 'light.entrada_bola', 'light.tauleta_de_nit', 'light.llum_de_peu', 'light.lampareta_ceramica', 'light.escriptori'])
    set(id, lightsOn.includes(id) && !night ? 'on' : 'off');
  set('media_player.sonos_sala', night ? 'idle' : 'playing', { friendly_name: 'Sonos sala', media_title: 'Teardrop', media_artist: 'Massive Attack', source_list: ['TV', 'Ràdio'], volume_level: 0.25 });
  set('media_player.sonos_estudi', night ? 'idle' : 'paused', { media_title: 'Flowers & Football Tops', media_artist: 'Glasvegas', source_list: ['Ràdio'], volume_level: 0.18 });
  set('media_player.televisio', night ? 'unavailable' : 'on', { device_class: 'tv', source: 'Pel·lícules', source_list: ['HDMI 1', 'HDMI 2', 'Pel·lícules', 'Sèries', 'YouTube'], volume_level: 0.12 });
  const pos = { menjador: 100, habitacio: 0, porta_cuina: 100, finestra_cuina: 60 };
  for (const [k, p] of Object.entries(pos)) set('cover.persiana_' + k, night ? 'closed' : p ? 'open' : 'closed', { current_position: night ? 0 : p });



  // Barra de situacions, com la del prototip. Només existeix en mode demo.
  const bar = document.createElement('div');
  bar.id = 'demobar';
  bar.style.cssText = 'position:fixed;left:0;right:0;bottom:0;padding:12px 16px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;background:#EEF0F3;font:500 14px system-ui,sans-serif;color:#1F2937;z-index:10';
  const chip = (label, href, sel) => `<a href="${href}" style="padding:8px 14px;border-radius:18px;text-decoration:none;${sel ? 'background:#0B1B3A;color:#fff' : 'background:#fff;color:#1F2937;box-shadow:inset 0 0 0 1px #C5CCD6'}">${label}</a>`;
  bar.innerHTML = '<b style="margin-right:4px;color:#A93A0A">DEMO · dades inventades</b>' +
    Object.keys(SC).map(k => chip(k.charAt(0).toUpperCase() + k.slice(1), '?demo=' + k, k === name)).join('') +
    chip('Dades reals', './', false);
  document.body.appendChild(bar);

  setTimeout(() => app.applyEvent({ a: E }), 0);

  const kwh = [0.12, 0.10, 0.10, 0.09, 0.09, 0.10, 0.14, 0.32, 0.28, 0.18, 0.16, 0.22, 0.95, 1.10, 0.40, 0.35, 0.30, 0.26, 0.38, 0.52, 0.44, 0.30, 0.20, 0.15];

  return {
    handle(msg) {
      if (msg.type === 'call_service' && msg.domain === 'calendar') {
        const day = (add, h, m = 0) => { const d = new Date(target); d.setDate(d.getDate() + add); d.setHours(h, m, 0, 0); return d.toISOString(); };
        const date = add => { const d = new Date(target); d.setDate(d.getDate() + add); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
        return Promise.resolve({ response: {
          'calendar.personal': { events: [
            { summary: 'Gimnas', start: day(0, 18), end: day(0, 19) },
            { summary: 'Dentista', start: day(0, 9, 30), end: day(0, 10, 15), location: 'Carrer Major, 12' },
            { summary: 'Gimnas', start: day(3, 18), end: day(3, 19) },
            { summary: 'Fisio', start: day(4, 17, 30), end: day(4, 18, 30), location: 'Centre esportiu' },
          ] },
          'calendar.familia': { events: [
            { summary: 'Pagar el rebut de l’aigua', start: date(0), end: date(1) },
            { summary: 'Sopar amb els veïns', start: day(1, 21), end: day(1, 23) },
            { summary: 'Visita dels cosins', start: date(5), end: date(8) },
          ] },
        } });
      }
      if (msg.type === 'call_service') {
        const ids = [].concat(msg.target.entity_id);
        const c = {};
        for (const id of ids) {
          if (msg.domain === 'cover') {
            const p = msg.service === 'open_cover' ? 100 : msg.service === 'close_cover' ? 0 : msg.service_data.position;
            c[id] = { '+': { s: p ? 'open' : 'closed', a: { current_position: p }, lc: Date.now() / 1000 } };
          } else if (msg.domain === 'media_player') {
            const a = E[id].a;
            if (msg.service === 'media_play_pause') E[id].s = E[id].s === 'playing' ? 'paused' : 'playing';
            if (msg.service === 'volume_set') a.volume_level = msg.service_data.volume_level;
            if (msg.service === 'select_source') a.source = msg.service_data.source;
            c[id] = { '+': { s: E[id].s, a: { ...a }, lc: Date.now() / 1000 } };
          } else if (msg.service === 'toggle' || msg.service === 'turn_off') {
            const cur = E[id].s;
            E[id].s = msg.service === 'turn_off' ? 'off' : cur === 'on' ? 'off' : 'on';
            c[id] = { '+': { s: E[id].s, lc: Date.now() / 1000 } };
          }
        }
        setTimeout(() => app.applyEvent({ c }), 600);
        return Promise.resolve({});
      }
      if (msg.type === 'history/history_during_period') {
        const id = msg.entity_ids[0];
        const e = E[id];
        if (id.startsWith('input_boolean')) {
          const dur = id.includes('dish') ? 125 : 90;
          return Promise.resolve({ [id]: [{ s: 'off', lu: e.lc - (dur + 300) * 60 }, { s: 'on', lu: e.lc - dur * 60 }, { s: 'off', lu: e.lc }] });
        }
        return Promise.resolve({ [id]: [{ s: '28', lu: ago(30) }, { s: '35', lu: ago(15) }, { s: '40', lu: ago(3) }] });
      }
      if (msg.type === 'energy/get_prefs') return Promise.resolve({ energy_sources: [{ type: 'grid', number_energy_price: 0.137 }] });
      if (msg.type === 'recorder/statistics_during_period') {
        const id = msg.statistic_ids[0];
        const from = new Date(msg.start_time).getTime();
        const step = msg.period === 'hour' ? 3600e3 : 300e3;
        const out = [];
        for (let ts = from; ts + step <= target.getTime(); ts += step) {
          const h = new Date(ts).getHours();
          out.push({ start: ts, change: kwh[h] * step / 3600e3 });
        }
        return Promise.resolve({ [id]: out });
      }
      return Promise.resolve({});
    },
  };
};
