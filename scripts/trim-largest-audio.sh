#!/bin/bash

AUDIO_DIR="public/audio"
DURATION=15
MAX_SIZE_MB=10

echo "Recortando solo el archivo de audio más pesado (>${MAX_SIZE_MB}MB)..."

largest_file=""
largest_size=0

for file in "$AUDIO_DIR"/*.wav; do
    if [ -f "$file" ]; then
        size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        size_mb=$((size / 1024 / 1024))
        
        if [ $size_mb -gt $MAX_SIZE_MB ] && [ $size -gt $largest_size ]; then
            largest_file="$file"
            largest_size=$size
        fi
    fi
done

if [ -z "$largest_file" ]; then
    echo "✅ No se encontraron archivos mayores a ${MAX_SIZE_MB}MB"
    echo ""
    echo "Tamaños actuales:"
    ls -lh "$AUDIO_DIR"/*.wav 2>/dev/null | awk '{print $5, $9}' || echo "No hay archivos .wav"
    exit 0
fi

filename=$(basename "$largest_file")
size_mb=$((largest_size / 1024 / 1024))
backup="${largest_file}.backup"
temp="${largest_file}.tmp"

echo "Archivo más pesado encontrado: $filename (${size_mb}MB)"
echo "Recortando a ${DURATION} segundos..."

cp "$largest_file" "$backup"

ffmpeg -i "$largest_file" -t $DURATION -acodec pcm_s16le -ar 44100 -f wav "$temp" -y -loglevel error

if [ $? -eq 0 ]; then
    mv "$temp" "$largest_file"
    new_size_mb=$(du -m "$largest_file" | cut -f1)
    echo "✅ Completado: ${size_mb}MB → ${new_size_mb}MB"
    rm "$backup"
else
    echo "❌ Error procesando $filename"
    rm "$temp" 2>/dev/null
    mv "$backup" "$largest_file"
    exit 1
fi

echo ""
echo "Tamaños finales:"
ls -lh "$AUDIO_DIR"/*.wav 2>/dev/null | awk '{print $5, $9}'
