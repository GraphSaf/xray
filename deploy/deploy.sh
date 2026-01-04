#!/bin/bash

# Скрипт для деплоя на удаленный сервер
SERVER="root@85.198.86.169"

echo "🚀 Деплой PocketBase на xray.zubrdental.ru"
echo "=========================================="

# Копирование скрипта установки на сервер
echo "📤 Копирование файлов на сервер..."
scp install-pocketbase.sh ${SERVER}:/root/
scp pb_schema.json ${SERVER}:/root/

# Выполнение установки
echo "⚙️ Запуск установки..."
ssh ${SERVER} 'bash /root/install-pocketbase.sh'

echo ""
echo "✅ Деплой завершен!"
echo "Откройте https://xray.zubrdental.ru/_/ для настройки"
