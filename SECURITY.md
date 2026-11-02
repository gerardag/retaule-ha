# Seguretat

## Com avisar d'un problema

Si trobes un problema de seguretat, no obris una incidència pública. Fes servir **Report a vulnerability** a la pestanya [Security](https://github.com/gerardag/retaule-ha/security) del repositori: l'avís només el veu el mantenidor.

Explica què has trobat, com reproduir-ho i quin impacte pot tenir. Intentaré respondre en pocs dies.

## Què cal tenir en compte en instal·lar-lo

- El token de Home Assistant és dins de `config.js` i el pot llegir qualsevol que obri la pàgina. Fes servir un usuari de HA sense administrador i limitat a la xarxa local.
- No exposis el port del contenidor a internet: deixa'l només a la xarxa de casa o darrere d'una VPN.
- No pugis mai `config.js` a cap repositori. El `.gitignore` ja l'exclou.
