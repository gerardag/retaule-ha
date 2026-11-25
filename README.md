<img src="web/favicon.svg" width="96" alt="">

# Retaule

Com els retaules antics, panells penjats a la paret que expliquen una història, però de casa teva.

Retaule és una pàgina per a una tauleta a la paret que es connecta a Home Assistant en temps real. A dalt de tot mostra el que és important ara mateix: una tempesta que s'acosta, una finestra oberta amb la calefacció en marxa, la cita d'aquí a una hora, el rentaplats que ha acabat o la franja de llum barata. Al costat, la temperatura, el consum, l'agenda, i botons per controlar llums, persianes, la tele i els altaveus. El que falla no embruta la pantalla: va a la campana.

Un sol `index.html`, sense dependències ni compilació, servit per un nginx que fa de pont cap a Home Assistant a la xarxa de casa. Així el navegador no surt a internet i funciona amb un usuari de HA limitat a la xarxa local. Pensat per a un iPad en horitzontal; en un mòbil en vertical passa a una sola columna amb la barra de controls a baix.

Cada aparell té els seus ajustos (botó al costat de la campana): tema clar, fosc o automàtic, idioma (català o castellà) i quines seccions es veuen, per exemple sense l'agenda. Es guarden al navegador, no a HA.

Per veure-la sense HA, obre la pàgina amb `?demo=descompte` (o `plats`, `roba`, `finestres`, `sensor`, `pluja`, `tempesta`, `nit`, `agenda`, `aspirant`). El panell d'aspiradors de la demo és a `?demo=descompte&vista=aspiradors`.

## Instal·lació

### 1. Usuari i token de Home Assistant

1. A HA, activa el mode avançat al teu perfil.
2. Configuració → Persones → pestanya **Usuaris** → Afegeix un usuari. Crea'l des d'aquí i no des de "Afegeix una persona", o et sortirà una persona nova al mapa.
   - Sense administrador.
   - Amb "Només pot iniciar sessió des de la xarxa local".
3. Inicia sessió amb aquest usuari, ves al seu perfil → Seguretat → Tokens d'accés de llarga durada → Crea un token, i copia'l.

### 2. Configuració

```shell
cp web/config.example.js config.js
```

Edita `config.js`: enganxa-hi el token i posa les entitats de casa teva. Les entitats que no tinguis, esborra-les; la pantalla amaga el que en depèn. Per trobar els noms de les entitats: HA → Configuració → Entitats.

Edita `docker-compose.yml` i posa a `HA_HOST` l'adreça de HA a la xarxa local (per exemple `192.168.1.100:8123`).

### 3. Arrencar

```shell
docker compose up -d
```

Obre `http://<servidor>:8080`.

## Tauleta

1. Obre la pàgina a Safari → Compartir → Afegir a la pantalla d'inici, i obre-la sempre des de la icona: queda a pantalla completa, sense el navegador.
2. Ajustos → Pantalla i brillantor → Bloqueig automàtic: Mai.
3. Ajustos → Accessibilitat → Accés guiat: activa'l i inicia'l amb la pantalla oberta (3 clics al botó de dalt).

## Com funciona

| Què | On |
|---|---|
| Missatge principal | Tempesta a prop, finestra oberta amb la calefacció en marxa, esdeveniment d'aquí a menys de 2 h, rentaplats o rentadora acabats, pluja, franja de llum barata, o "Tot en ordre". Els altres avisos actius surten en petit a sota |
| Columna de la dreta | Exterior, interior i calefacció, preu de la llum, consum, proper esdeveniment |
| Campana | Sensors, calendaris, llums o persianes que no responen. Mai surten a la pantalla principal |
| Energia | kWh per hora d'avui, i € d'avui, la setmana i el mes amb el preu del panell d'energia de HA i el descompte de la franja |

Sense tocar res, al cap d'un minut torna a la pantalla principal. El tema clar o fosc segueix `sun.sun`; es pot forçar amb `?tema=clar` o `?tema=fosc`. Si canvies `index.html` al servidor, la tauleta es recarrega sola en menys de 30 minuts.

## Alarma amb codi a la pantalla

Amb l'alarma activada, la pantalla és tota per a l'alarma. Si l'entitat de HA demana codi, surt un teclat; si no, un botó que s'ha de tocar dues vegades.

Si vols que la pantalla de la paret demani codi però l'app de HA no, crea aquest script a HA (canvia `'0000'` pel teu codi i l'entitat per la teva alarma) i posa'l a `config.js` com a `alarmScript: 'script.<id>'`. El codi només és a HA: la pàgina l'envia a l'script, que el comprova i torna `ok`.

```yaml
alias: Desactivar alarma des de la pantalla
description: El crida la pantalla de la paret amb el codi del teclat. Torna ok true o false.
mode: single
icon: mdi:shield-key
fields:
  code:
    name: Codi
    required: true
    selector:
      text:
sequence:
  - if:
      - condition: template
        value_template: "{{ code | string == '0000' }}"
    then:
      - action: alarm_control_panel.alarm_disarm
        target:
          entity_id: alarm_control_panel.casa
      - variables:
          resultat:
            ok: true
      - stop: Desactivada
        response_variable: resultat
    else:
      - variables:
          resultat:
            ok: false
      - stop: Codi incorrecte
        response_variable: resultat
```

## Aspiradors

Panell opcional per enviar els robots aspiradors a estances concretes, a una planta o a tota la casa, triant al plànol. Surt un botó al costat del de les persianes si `config.js` té el bloc `vacuums`, i es pot amagar als ajustos de cada aparell.

**Plànols.** Un SVG per planta, a la carpeta `planols/` (al costat de `config.js`). Opcionalment, un segon SVG vertical per a mòbil (`planVertical`). Els colors i el tema clar o fosc els posa la pàgina; dins l'SVG només calen aquestes classes:

| Element | Classe | Què és |
|---|---|---|
| `rect`, `path`... | `zona` amb `data-zona="sala"` | Estança que es pot tocar. El `data-zona` és la clau de `rooms` |
| `text` o `path` | `rotol` amb `data-zona="sala"` | Nom de l'estança (canvia de color quan està triada) |
| línies | `paret` | Parets |
| línies | `porta` | Portes i obertures (més primes) |

Les estances que no tinguin `class="zona"` (una escala, per exemple) no es poden triar mai.

**Script de HA.** La pàgina no envia res al robot directament: crida l'script de `vacuums.script` amb `habitacions` (llista dels `value` de les estances triades), `passades` (`"1"` o `"2"`) i `potencia` (un valor de `speeds`, si n'hi ha). L'script tradueix cada estança al número d'habitació del robot i crida l'acció de neteja per habitacions, que depèn de la integració. Diverses estances de l'SVG poden tenir el mateix `value` si per al robot són una sola habitació.

Exemple per a robots Xiaomi amb la integració Xiaomi Miot (els números d'habitació es troben provant: normalment comencen pel 10):

```yaml
alias: Aspiradors - Neteja habitacions
mode: single
fields:
  habitacions: {name: Habitacions, required: true, selector: {object: {}}}
  passades: {name: Passades, default: "1", selector: {select: {options: ["1", "2"]}}}
  potencia: {name: Potència, selector: {text: {}}}
variables:
  ids: {sala: 10, cuina: 11, rebedor: 12}
  rooms: >-
    {% set ns = namespace(l=[]) %}{% for h in habitacions if h in ids %}{% set ns.l = ns.l + [ids[h] | string] %}{% endfor %}{{ ns.l | join(',') }}
sequence:
  - if: "{{ rooms | string != '' }}"
    then:
      - if: "{{ potencia is defined and potencia }}"
        then:
          - action: vacuum.set_fan_speed
            target: {entity_id: vacuum.robot}
            data: {fan_speed: "{{ potencia }}"}
      - action: xiaomi_miot.set_miot_property   # segona passada: siid 7, piid 1 (pot variar segons el model)
        data: {entity_id: vacuum.robot, siid: 7, piid: 1, value: "{{ 1 if passades | string == '2' else 0 }}"}
      - action: xiaomi_miot.call_action         # netejar habitacions: siid 7, aiid 3
        data: {entity_id: vacuum.robot, siid: 7, aiid: 3, params: "{{ [rooms | string, 0, 1] }}"}
```

Els números d'habitació van com a text (`"10"`, no `10`): amb un sol número, si HA el converteix en enter, el robot va a una altra habitació. Per això `params` es construeix sencer dins la plantilla.

Amb un robot ocupat (netejant o tornant a la base), la pàgina ofereix aturar-lo en lloc d'enviar l'ordre, perquè alguns robots no canvien de feina a mitges. Per defecte atura amb `vacuum.return_to_base`; si el teu robot ho fa d'una altra manera, posa-ho a `vacuums.stop`.

## Seguretat

El token és visible a `config.js` per a qualsevol que pugui obrir la pàgina, i un usuari sense administrador encara pot encendre i apagar coses. No exposis el port 8080 a internet: deixa'l només a la xarxa de casa (o VPN).

## Contribuir

Les millores són benvingudes per pull request. Vegeu [CONTRIBUTING.md](CONTRIBUTING.md).

## Llicència

MIT. Vegeu [LICENSE](LICENSE).
