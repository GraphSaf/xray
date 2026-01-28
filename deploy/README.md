# Деплой ДОЗ-3 на сервер

## Быстрый старт

### Вариант 1: Автоматический (рекомендуется)

Выполните на сервере **xray.zubrdental.ru**:

```bash
# Скачать и запустить установку
curl -sSL https://raw.githubusercontent.com/GraphSaf/xray/claude/radiation-dose-reporting-app-RM8Cf/deploy/full-deploy.sh | bash
```

Затем скопируйте frontend файлы:

```bash
# С локальной машины
cd /path/to/xray
scp -r dist/* root@85.198.86.169:/var/www/doz3/
```

### Вариант 2: Ручная установка

1. **Подключитесь к серверу:**
```bash
ssh root@85.198.86.169
```

2. **Скачайте скрипт:**
```bash
cd /root
wget https://raw.githubusercontent.com/GraphSaf/xray/claude/radiation-dose-reporting-app-RM8Cf/deploy/full-deploy.sh
chmod +x full-deploy.sh
```

3. **Запустите установку:**
```bash
./full-deploy.sh
```

4. **Загрузите frontend:**
```bash
# Создайте архив на локальной машине
cd /path/to/xray
tar -czf dist.tar.gz dist/

# Скопируйте на сервер
scp dist.tar.gz root@85.198.86.169:/tmp/

# На сервере распакуйте
ssh root@85.198.86.169
cd /var/www/doz3
tar -xzf /tmp/dist.tar.gz --strip-components=1
```

## После установки

1. **Откройте Admin UI:**
   - URL: https://xray.zubrdental.ru/_/
   - Создайте первый admin аккаунт

2. **Импортируйте схему БД:**
   - Settings → Import collections
   - Выберите файл: `/opt/pocketbase/pb_data/pb_schema.json`
   - Или создайте коллекцию `doz3_reports` вручную

3. **Проверьте приложение:**
   - https://xray.zubrdental.ru/

## Структура

```
Frontend:   https://xray.zubrdental.ru/          (React приложение)
API:        https://xray.zubrdental.ru/api/      (PocketBase REST API)
Admin UI:   https://xray.zubrdental.ru/_/        (PocketBase Admin)
```

## Директории на сервере

```
/var/www/doz3/           - Frontend файлы (HTML, JS, CSS)
/opt/pocketbase/         - PocketBase backend
/opt/pocketbase/pb_data/ - База данных и файлы
```

## Обновление frontend

```bash
# На локальной машине
npm run build

# Копирование на сервер
scp -r dist/* root@85.198.86.169:/var/www/doz3/
```

## Логи

```bash
# PocketBase логи
journalctl -u pocketbase -f

# Nginx логи
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## Управление сервисами

```bash
# PocketBase
systemctl status pocketbase
systemctl restart pocketbase
systemctl stop pocketbase

# Nginx
systemctl status nginx
systemctl reload nginx
```
