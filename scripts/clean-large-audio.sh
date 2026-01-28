#!/bin/bash

echo "🧹 Limpiando archivos grandes de audio del historial de Git"
echo ""
echo "Este proceso:"
echo "  1. Removerá archivos de audio grandes del historial"
echo "  2. Mantendrá los archivos pequeños (2.5MB) del commit actual"
echo "  3. Reducirá significativamente el tamaño del repositorio"
echo ""
read -p "¿Continuar? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Operación cancelada"
    exit 1
fi

echo ""
echo "📦 Tamaño actual del repositorio:"
du -sh .git
echo ""

echo "🔄 Reescribiendo historial (esto puede tardar)..."
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch public/audio/*.wav' \
  --prune-empty --tag-name-filter cat -- --all

echo ""
echo "🧹 Limpiando referencias..."
git for-each-ref --format="%(refname)" refs/original/ | xargs -n 1 git update-ref -d 2>/dev/null || true

echo ""
echo "🗑️  Ejecutando garbage collection..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo ""
echo "✅ Limpieza completada!"
echo ""
echo "📦 Nuevo tamaño del repositorio:"
du -sh .git
echo ""
echo "📝 Ahora agrega los archivos pequeños de vuelta:"
echo "   git add public/audio/*.wav"
echo "   git commit -m 'Add trimmed audio files (15s demos)'"
echo ""
echo "⚠️  IMPORTANTE: Para actualizar el remoto necesitarás:"
echo "   git push --force --all"
