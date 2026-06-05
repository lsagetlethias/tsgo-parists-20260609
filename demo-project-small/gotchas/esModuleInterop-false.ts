// GOTCHA 1 — esModuleInterop n'est plus désactivable (breaking change TS 7)
// ========================================================================
// Avant : beaucoup de projets legacy tournaient avec `esModuleInterop: false`
// et géraient les imports CJS à la main. En TS 7, l'option a été SUPPRIMÉE :
//   - tsc 6.x : TS5107 (déprécié, exige "ignoreDeprecations": "6.0")
//   - tsgo    : TS5108 (l'option a été retirée, retire-la de ta config)
// Le point de la démo : tsgo ne vous sauve pas des dettes de config — il les
// révèle, juste 10x plus vite. (Voir esModuleInterop-removed.tsconfig.json.)

// `node:path` est un module CJS (export =). Le default-import ci-dessous EXIGE
// l'interop. C'est le cas d'école qui, jadis sous `esModuleInterop:false`,
// sortait TS1259. En TS 7 l'interop est le défaut -> ça compile sans broncher.
import path from "node:path";

console.log(path.join("packages", "core"));

// Fix migration : retirer `esModuleInterop: false`. L'interop est désormais le
// comportement standard ; la forme `import x = require("…")` reste possible.
