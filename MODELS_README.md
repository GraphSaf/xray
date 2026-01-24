# 3D Models for Dental Positioning Simulator

## Current Models

All models are stored in S3 (Beget cloud storage):
- https://s3.ru1.storage.beget.cloud/0f31e7f56d88-xrayhub/

### Available Models:

1. **teeth_upper.glb** (21.46 MB) - Верхние зубы
2. **teeth_lower.glb** (21.44 MB) - Нижние зубы
3. **ms_upper.glb** (100.45 KB) - Верхние мягкие ткани/десны
4. **gums_lower.glb** (114.11 KB) - Нижние десны
5. **throat.glb** (20.68 KB) - Гортань
6. **tongue.glb** (132 B) - Язык
7. **xray_sensor.glb** (17.56 KB) - Датчик рентгена
8. **xray_tubus.glb** (73.11 KB) - Тубус (не используется в текущей версии)

### Local Models:

- **placeholder.glb** - Загрузочный индикатор (хранится локально в /public/models/)

## Model Setup

All models are configured with:
- Pivot point at world origin (0, 0, 0)
- Separate Pivot and Object transforms
- Shadow casting and receiving enabled
- Optional transparency (для зубов)

## Model Transform System

Each model has two levels of transformation:

1. **Pivot** - rotation axes position (where the model rotates around)
   - Position: [x, y, z]
   - Rotation: [x, y, z]

2. **Object** - the model itself offset from pivot
   - Position: [x, y, z]
   - Rotation: [x, y, z]

This allows independent control of rotation center and model position.

## Adding New Models

To add a new model:

1. Upload .glb/.gltf file to S3 storage
2. Add URL to MODEL_URLS in DentalPositioningSimulator.tsx
3. Create state variables for pivot/object transforms
4. Add UniversalModel component in render
5. Add controls in settings panel

## Licenses

Ensure all models are:
- Free / Creative Commons
- Allowed for commercial use
- Do not require attribution (or add to credits)
