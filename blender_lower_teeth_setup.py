import bpy
import mathutils

"""
Скрипт настройки позиции и ротации нижних зубов
"""

# Найти объект нижних зубов
lower_teeth = None
for obj in bpy.data.objects:
    name_lower = obj.name.lower()
    if 'нижн' in name_lower or 'lower' in name_lower or 'bottom' in name_lower:
        if 'зуб' in name_lower or 'teeth' in name_lower or 'tooth' in name_lower:
            lower_teeth = obj
            print(f"Найдены нижние зубы: {obj.name}")
            break

if not lower_teeth:
    print("ОШИБКА: Нижние зубы не найдены!")
    print("\nСписок всех объектов в сцене:")
    for obj in bpy.data.objects:
        print(f"  - {obj.name}")
else:
    # Применить настройки

    # 1. Position (P) - местоположение объекта в мире
    lower_teeth.location = mathutils.Vector((0.00, 0.00, 0.00))
    print(f"✓ Установлена позиция: [0.00, 0.00, 0.00]")

    # 2. Origin offset (O) - смещение origin точки
    # Для этого нужно сместить геометрию относительно origin
    offset = mathutils.Vector((0.00, -0.80, -0.20))

    # Переключаемся в режим редактирования
    bpy.context.view_layer.objects.active = lower_teeth
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')

    # Применяем смещение к геометрии
    bpy.ops.transform.translate(value=offset)

    # Возвращаемся в объектный режим
    bpy.ops.object.mode_set(mode='OBJECT')
    print(f"✓ Применено смещение origin: [0.00, -0.80, -0.20]")

    # 3. Rotation (R) - ротация в радианах (Euler XYZ)
    lower_teeth.rotation_euler = mathutils.Euler((0.20, 0.00, 0.00), 'XYZ')
    print(f"✓ Установлена ротация: [0.20, 0.00, 0.00] рад")

    print("\n" + "="*60)
    print("✓ НАСТРОЙКА НИЖНИХ ЗУБОВ ЗАВЕРШЕНА!")
    print(f"  Объект: {lower_teeth.name}")
    print(f"  Position: {list(lower_teeth.location)}")
    print(f"  Rotation: {list(lower_teeth.rotation_euler)}")
    print("="*60)
