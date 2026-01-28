# Archivos de Audio

Archivos de demostración de frecuencias binaurales (15 segundos cada uno, ~2.5MB).

## Archivos incluidos

- `theta.wav` - Muestra de frecuencia Theta (relajación profunda)
- `alfa.wav` - Muestra de frecuencia Alpha (calma y creatividad)
- `beta.wav` - Muestra de frecuencia Beta (enfoque y concentración)
- `gamma.wav` - Muestra de frecuencia Gamma (alto rendimiento)

## Nota

Los archivos fueron recortados a 15 segundos para el demo. Para producción, considera usar archivos completos desde un servicio de almacenamiento (S3, Cloudinary, etc.) y actualizar las URLs en `AudioSection.tsx`.

## Recortar archivos

Si necesitas recortar nuevos archivos de audio, usa el script:
```bash
./scripts/trim-audio.sh
```
