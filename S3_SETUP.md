# Настройка S3 для 3D моделей

## Проблема

Сейчас S3 bucket возвращает 403 Forbidden при попытке загрузить модели. Это означает, что bucket не настроен для публичного доступа.

## Решение

Необходимо настроить S3 bucket на Beget для публичного чтения файлов.

### Шаги настройки на Beget S3:

1. Войдите в панель управления Beget
2. Перейдите в раздел S3 хранилище
3. Выберите bucket `0f31e7f56d88-xrayhub`
4. Настройте политику доступа (Bucket Policy):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::0f31e7f56d88-xrayhub/*"
    }
  ]
}
```

5. Настройте CORS для cross-origin запросов:

```json
[
  {
    "AllowedOrigins": ["https://xrayhub.ru", "http://localhost:5173"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

6. Убедитесь, что модели загружены:
   - teeth_upper.glb (21.46 MB)
   - teeth_lower.glb (21.44 MB)
   - ms_upper.glb (100.45 KB)
   - gums_lower.glb (114.11 KB)
   - throat.glb (20.68 KB)
   - tongue.glb (132 B)
   - xray_sensor.glb (17.56 KB)

## После настройки S3

1. Откройте `src/components/DentalPositioningSimulator.tsx`
2. Раскомментируйте строки с MODEL_URLS
3. Замените PlaceholderModel обратно на UniversalModel
4. Верните импорт useGLTF из @react-three/drei
5. Пересоберите и задеплойте

## Проверка доступности

После настройки проверьте доступность моделей:

```bash
curl -I https://s3.ru1.storage.beget.cloud/0f31e7f56d88-xrayhub/teeth_upper.glb
```

Должен вернуться HTTP 200 OK, а не 403 Forbidden.

## Альтернативное решение

Если настройка S3 невозможна, можно:
1. Загрузить модели локально в `public/models/`
2. Изменить MODEL_URLS на локальные пути
3. Учесть, что это увеличит размер деплоя на ~43 MB
