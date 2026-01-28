import bpy
import mathutils

"""
Скрипт настройки визуализации источника света для рентген-лучей
"""

# Найти источник света (предполагаем что это Area Light рядом с xray_light_area)
light_object = None
for obj in bpy.data.objects:
    if obj.type == 'LIGHT':
        light_object = obj
        print(f"Найден источник света: {obj.name}")
        break

if not light_object:
    print("ОШИБКА: Источник света не найден!")
else:
    # 1. Убрать вектор направления света (display vector)
    light_object.data.show_cone = False
    print(f"✓ Убран вектор направления для света '{light_object.name}'")

    # 2. Создать светопропускаемый шар на месте источника света
    # Получить позицию источника света
    light_location = light_object.location.copy()

    # Создать UV Sphere
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=0.1,  # Радиус 10см для видимости
        location=light_location
    )

    sphere = bpy.context.active_object
    sphere.name = "Light_Indicator_Sphere"
    print(f"✓ Создан шар '{sphere.name}' в позиции {light_location}")

    # Создать материал для шара (светопропускаемый)
    mat = bpy.data.materials.new(name="Translucent_Light_Indicator")
    mat.use_nodes = True
    sphere.data.materials.append(mat)

    # Настроить ноды материала
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links

    # Очистить существующие ноды
    nodes.clear()

    # Создать Translucent BSDF
    translucent = nodes.new(type='ShaderNodeBsdfTranslucent')
    translucent.location = (0, 0)
    translucent.inputs['Color'].default_value = (0.8, 0.9, 1.0, 1.0)  # Голубоватый цвет

    # Создать Emission для свечения
    emission = nodes.new(type='ShaderNodeEmission')
    emission.location = (0, 150)
    emission.inputs['Color'].default_value = (0.7, 0.85, 1.0, 1.0)  # Голубоватое свечение
    emission.inputs['Strength'].default_value = 2.0

    # Создать Mix Shader
    mix = nodes.new(type='ShaderNodeMixShader')
    mix.location = (300, 0)
    mix.inputs['Fac'].default_value = 0.5  # 50% translucent, 50% emission

    # Создать Material Output
    output = nodes.new(type='ShaderNodeOutputMaterial')
    output.location = (500, 0)

    # Связать ноды
    links.new(translucent.outputs['BSDF'], mix.inputs[1])
    links.new(emission.outputs['Emission'], mix.inputs[2])
    links.new(mix.outputs['Shader'], output.inputs['Surface'])

    print(f"✓ Создан светопропускаемый материал для шара")

    # Сделать шар частично прозрачным в viewport
    mat.blend_method = 'BLEND'
    mat.shadow_method = 'NONE'  # Без теней от индикатора

    print("\n" + "="*60)
    print("✓ НАСТРОЙКА ЗАВЕРШЕНА!")
    print(f"  - Убран вектор направления света")
    print(f"  - Создан светопропускаемый шар-индикатор на месте света")
    print("="*60)
