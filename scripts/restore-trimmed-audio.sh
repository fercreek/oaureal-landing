#!/bin/bash

AUDIO_DIR="public/audio"
DURATION=15

echo "📁 Restaurando archivos de audio recortados"
echo ""
echo "Este script recortará archivos de audio a ${DURATION} segundos."
echo "Coloca los archivos originales en la carpeta temporal:"
echo "  mkdir -p /tmp/audio-original"
echo "  # Copia tus archivos originales ahí"
echo ""
read -p "¿Tienes los archivos originales listos? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo ""
    echo "Cuando tengas los archivos originales, ejecuta:"
    echo "  1. Coloca los archivos en /tmp/audio-original/"
    echo "  2. Ejecuta: ./scripts/trim-audio.sh"
    exit 0
fi

if [ ! -d "/tmp/audio-original" ]; then
    echo "❌ No se encontró /tmp/audio-original/"
    echo "Crea la carpeta y coloca los archivos originales ahí"
    exit 1
fi

echo ""
echo "Recortando archivos desde /tmp/audio-original/..."

for file in /tmp/audio-original/*.wav /tmp/audio-original/*.WAV; do
    if [ -f "$file" ]; then
        filename=$(basename "$file" | tr '[:upper:]' '[:lower:]')
        
        case "$filename" in
            *theta*)
                output="$AUDIO_DIR/theta.wav"
                ;;
            *alfa*|*alpha*)
                output="$AUDIO_DIR/alfa.wav"
                ;;
            *beta*)
                output="$AUDIO_DIR/beta.wav"
                ;;
            *gamma*)
                output="$AUDIO_DIR/gamma.wav"
                ;;
            *)
                echo "  ⚠️  Archivo no reconocido: $filename"
                continue
                ;;
        esac
        
        echo "  Procesando: $filename → $(basename $output)"
        ffmpeg -i "$file" -t $DURATION -acodec pcm_s16le -ar 44100 -f wav "$output" -y -loglevel error
        
        if [ $? -eq 0 ]; then
            original_size=$(du -h "$file" | cut -f1)
            new_size=$(du -h "$output" | cut -f1)
            echo "    ✓ $original_size → $new_size"
        else
            echo "    ✗ Error procesando $filename"
        fi
    fi
done

echo ""
echo "✅ Archivos recortados y guardados en $AUDIO_DIR/"
echo ""
echo "Ahora agrega los archivos a Git:"
echo "  git add public/audio/*.wav"
echo "  git commit -m 'Add trimmed audio files (15s demos)'"
