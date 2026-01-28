#!/bin/bash

echo "⚠️  ADVERTENCIA: Este script reescribirá el historial de Git"
echo "Asegúrate de hacer backup antes de continuar"
echo ""
read -p "¿Continuar? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Operación cancelada"
    exit 1
fi

echo ""
echo "Removiendo archivos grandes de audio del historial..."

git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch public/audio/*.wav' \
  --prune-empty --tag-name-filter cat -- --all

echo ""
echo "Limpiando referencias..."
git for-each-ref --format="%(refname)" refs/original/ | xargs -n 1 git update-ref -d 2>/dev/null || true

echo ""
echo "Ejecutando garbage collection..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo ""
echo "✅ Historial limpiado. Los archivos grandes han sido removidos."
echo ""
echo "IMPORTANTE: Necesitarás hacer force push:"
echo "  git push --force --all"
echo "  git push --force --tags"
