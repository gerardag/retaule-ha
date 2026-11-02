# Com contribuir

Gràcies per voler millorar Retaule.

1. Fes un fork del repositori i treballa en una branca pròpia.
2. Per provar-ho sense Home Assistant, serveix la carpeta `web/` amb qualsevol servidor estàtic (per exemple `python3 -m http.server`, amb un `config.js` buit al costat) i obre la pàgina amb `?demo=descompte`. Totes les situacions de la demo surten a la barra de baix.
3. Obre una pull request i omple la plantilla.

## Criteris

- Un sol `index.html`, sense frameworks, compilació ni dependències noves.
- Tot el que depèn de cada casa va a `config.js`. Si una entitat no hi és, la pantalla amaga la dada, no falla.
- Els errors (sensors que no responen, calendaris que no carreguen) van a la campana, mai a la pantalla principal.
- Textos en català, curts i clars.
- Cap dada personal als fitxers ni a les captures: ni tokens, ni IPs, ni noms d'entitats reals.

Per a problemes de seguretat, vegeu [SECURITY.md](SECURITY.md).
