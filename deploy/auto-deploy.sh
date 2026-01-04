#!/bin/bash
# Автоматический деплой с локальной машины на сервер
# Требуется: scp и ssh доступ к серверу

SERVER="root@85.198.86.169"
REMOTE_DIR="/var/www/doz3"

echo "🚀 Автоматический деплой на xray.zubrdental.ru"
echo "================================================"

# 1. Копирование скрипта установки на сервер
echo "📤 Копирование скрипта установки..."
scp full-deploy.sh ${SERVER}:/root/

# 2. Запуск установки на сервере
echo "⚙️ Запуск установки PocketBase и Nginx..."
ssh ${SERVER} 'bash /root/full-deploy.sh'

# 3. Копирование frontend файлов
echo "📤 Копирование frontend файлов..."
ssh ${SERVER} "rm -rf ${REMOTE_DIR}/*"
scp -r ../dist/* ${SERVER}:${REMOTE_DIR}/

# 4. Проверка
echo "✅ Проверка деплоя..."
ssh ${SERVER} 'systemctl status pocketbase --no-pager | head -5'
ssh ${SERVER} 'nginx -t'

echo ""
echo "✅ Деплой завершен!"
echo "================================================"
echo "🌐 Приложение: https://xray.zubrdental.ru/"
echo "🔧 Admin:      https://xray.zubrdental.ru/_/"
echo ""
echo "Не забудьте:"
echo "1. Создать admin аккаунт в PocketBase"
echo "2. Импортировать схему коллекции"
echo "================================================"
