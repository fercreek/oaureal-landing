#!/bin/bash

AUDIO_DIR="public/audio"
DURATION=15

echo "Recortando archivos de audio a ${DURATION} segundos..."

for file in "$AUDIO_DIR"/*.wav; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        backup="${file}.backup"
        temp="${file}.tmp"
        
        echo "Procesando: $filename"
        
        cp "$file" "$backup"
        
        ffmpeg -i "$file" -t $DURATION -acodec pcm_s16le -ar 44100 -f wav "$temp" -y -loglevel error
        
        if [ $? -eq 0 ]; then
            mv "$temp" "$file"
            original_size=$(du -h "$backup" | cut -f1)
            new_size=$(du -h "$file" | cut -f1)
            echo "  ✓ Completado: $original_size → $new_size"
            rm "$backup"
        else
            echo "  ✗ Error procesando $filename"
            rm "$temp" 2>/dev/null
            mv "$backup" "$file"
        fi
    fi
done

echo "¡Listo! Archivos recortados a ${DURATION} segundos."
