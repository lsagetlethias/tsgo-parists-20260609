#!/usr/bin/env bash
# Prépare le "gros projet" de la démo 1 : microsoft/vscode, le benchmark
# officiel de l'équipe TypeScript (78s -> 7.5s sur leur matériel).
#
# Reproductibilité : on pinne un TAG. Le tsc cold dépasse confortablement les
# 30s requises sur un MBP M-series (cf. README.md).
#
# Idempotent : relançable, ne re-clone pas si le dossier existe déjà.
set -euo pipefail

# --- Paramètres (surchargeables par variables d'env) -------------------------
REPO="${REPO:-https://github.com/microsoft/vscode.git}"
# Tag stable pinné. Vérifie/ajuste le jour J : https://github.com/microsoft/vscode/tags
TAG="${TAG:-1.123.0}"
DEST="${DEST:-vscode}"
# Build tsgo PINNÉ sur la version validée (idem lockfile du petit projet), pas
# `latest` : les builds `dev` quotidiens peuvent régresser un diagnostic ou un
# code d'erreur sur lequel reposent les démos. Bumper en connaissance de cause.
TSGO_VERSION="${TSGO_VERSION:-7.0.0-dev.20260605.1}"

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$here"

echo "==> Cible : $REPO @ $TAG -> $DEST/"

# --- Clone peu profond du tag (pas besoin de l'historique) -------------------
if [ -d "$DEST/.git" ]; then
  echo "==> $DEST/ existe déjà, on saute le clone."
else
  git clone --depth 1 --branch "$TAG" "$REPO" "$DEST"
fi

cd "$DEST"

# --- Dépendances (lourd : Electron + modules natifs, ~10-20 min) -------------
echo "==> npm ci (long la première fois)..."
npm ci

# --- tsgo, en side-by-side du tsc du projet ----------------------------------
echo "==> Ajout de @typescript/native-preview@$TSGO_VERSION (tsgo)..."
npm install --no-save "@typescript/native-preview@$TSGO_VERSION"

# --- Vérif hyperfine (outil de mesure de la démo, cf. commandes ci-dessous) --
# zsh : le mot-clé `time` n'imprime RIEN sur un process node (npx/tsc/tsgo), on
# mesure donc avec hyperfine.
if ! command -v hyperfine >/dev/null 2>&1; then
  echo "⚠️  hyperfine introuvable : 'brew install hyperfine' avant la démo."
fi

cat <<'EOF'

==> Setup terminé.

Commandes de démo (depuis demo-project-big/vscode/) :

  # /!\ zsh : `time npx ...` n'affiche RIEN (process node). On mesure à l'hyperfine.
  # /!\ tsc OOM sur vscode au heap Node par défaut (~4.2GB) : il FAUT 8GB, comme
  #     le gulp de vscode (--max-old-space-size=8192). tsgo (natif) s'en passe.

  # Comparo complet tsc vs tsgo, en coulisse (sort le ratio ~7,8x pour la slide)
  hyperfine -i --warmup 0 --runs 3 \
    --prepare 'find src -name "*.tsbuildinfo" -delete' \
    -n tsc  'NODE_OPTIONS=--max-old-space-size=8192 npx tsc -p src/tsconfig.json --noEmit' \
    -n tsgo 'npx tsgo -p src/tsconfig.json --noEmit'

  # tsgo seul, en live (le wow)
  hyperfine --warmup 1 --runs 5 -n tsgo 'npx tsgo -p src/tsconfig.json --noEmit'

  # Mémoire (pic RSS) + diagnostics détaillés
  NODE_OPTIONS=--max-old-space-size=8192 /usr/bin/time -l npx tsc -p src/tsconfig.json --noEmit
  /usr/bin/time -l npx tsgo -p src/tsconfig.json --noEmit

EOF
