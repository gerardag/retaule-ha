<img src="web/favicon.svg" width="96" alt="">

# Retaule

Com els retaules antics, panells penjats a la paret que expliquen una història, però de casa teva.

Retaule és una pàgina per a una tauleta a la paret que es connecta a Home Assistant en temps real. A dalt de tot mostra el que és important ara mateix: una tempesta que s'acosta, una finestra oberta amb la calefacció en marxa, la cita d'aquí a una hora, el rentaplats que ha acabat o la franja de llum barata. Al costat, la temperatura, el consum, l'agenda, i botons per controlar llums, persianes, la tele i els altaveus. El que falla no embruta la pantalla: va a la campana.

Un sol `index.html`, sense dependències ni compilació, servit per un nginx que fa de pont cap a Home Assistant a la xarxa de casa. Així el navegador no surt a internet i funciona amb un usuari de HA limitat a la xarxa local. Pensat per a un iPad en horitzontal.

Per veure-la sense HA, obre la pàgina amb `?demo=descompte` (o `plats`, `roba`, `finestres`, `sensor`, `pluja`, `tempesta`, `nit`, `agenda`).

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

## Seguretat

El token és visible a `config.js` per a qualsevol que pugui obrir la pàgina, i un usuari sense administrador encara pot encendre i apagar coses. No exposis el port 8080 a internet: deixa'l només a la xarxa de casa (o VPN).

## Contribuir

Les millores són benvingudes per pull request. Vegeu [CONTRIBUTING.md](CONTRIBUTING.md).

## Llicència

MIT. Vegeu [LICENSE](LICENSE).
