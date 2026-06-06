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

cat <<'EOF'

==> Setup terminé.

Commandes de démo (depuis demo-project-big/vscode/) :

  # Référence tsc (cold : supprime d'abord le cache incrémental)
  rm -f src/*.tsbuildinfo
  time npx tsc  -p src/tsconfig.json --noEmit

  # tsgo, même cible
  time npx tsgo -p src/tsconfig.json --noEmit

  # Pour la slide mémoire / diagnostics détaillés
  npx tsc  -p src/tsconfig.json --noEmit --extendedDiagnostics
  npx tsgo -p src/tsconfig.json --noEmit --extendedDiagnostics

EOF
