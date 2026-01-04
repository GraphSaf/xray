#!/bin/bash
set -e

echo "🚀 Установка PocketBase на xray.zubrdental.ru"
echo "=============================================="

# Переменные
DOMAIN="xray.zubrdental.ru"
PB_VERSION="0.22.20"
PB_DIR="/opt/pocketbase"
EMAIL="admin@zubrdental.ru"

# 1. Обновление системы
echo "📦 Обновление системы..."
apt update && apt upgrade -y

# 2. Установка необходимых пакетов
echo "📦 Установка nginx, certbot..."
apt install -y nginx certbot python3-certbot-nginx unzip curl

# 3. Скачивание PocketBase
echo "📥 Скачивание PocketBase v${PB_VERSION}..."
mkdir -p ${PB_DIR}
cd ${PB_DIR}
curl -L "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip" -o pocketbase.zip
unzip -o pocketbase.zip
rm pocketbase.zip
chmod +x pocketbase

# 4. Создание systemd service
echo "⚙️ Настройка systemd service..."
cat > /etc/systemd/system/pocketbase.service <<'EOF'
[Unit]
Description=PocketBase
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/pocketbase
ExecStart=/opt/pocketbase/pocketbase serve --http=127.0.0.1:8090
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# 5. Запуск PocketBase
echo "▶️ Запуск PocketBase..."
systemctl daemon-reload
systemctl enable pocketbase
systemctl start pocketbase
sleep 3
systemctl status pocketbase --no-pager

# 6. Настройка Nginx
echo "🌐 Настройка Nginx..."
cat > /etc/nginx/sites-available/${DOMAIN} <<EOF
server {
    listen 80;
    server_name ${DOMAIN};

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:8090;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Активация конфига
ln -sf /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# 7. Установка SSL сертификата
echo "🔒 Установка SSL сертификата..."
certbot --nginx -d ${DOMAIN} --non-interactive --agree-tos --email ${EMAIL}

# 8. Настройка CORS в PocketBase (через API после первого запуска)
echo "⏳ Ожидание полной инициализации PocketBase..."
sleep 5

echo ""
echo "✅ Установка завершена!"
echo "=============================================="
echo "PocketBase доступен по адресу: https://${DOMAIN}"
echo "Admin UI: https://${DOMAIN}/_/"
echo ""
echo "ВАЖНО: Создайте первого admin пользователя:"
echo "1. Откройте https://${DOMAIN}/_/"
echo "2. Создайте admin аккаунт"
echo "3. Создайте коллекцию 'doz3_reports' с полями:"
echo "   - organizationName (text)"
echo "   - organizationAddress (text)"
echo "   - organizationOKPO (text)"
echo "   - responsibleName (text)"
echo "   - responsiblePosition (text)"
echo "   - responsiblePhone (text)"
echo "   - periodYear (number)"
echo "   - periodQuarter (number, optional)"
echo "   - procedures (json)"
echo "   - totalDose_personmGy (number)"
echo "   - status (select: draft, completed, archived)"
echo ""
echo "4. В Settings → Import collections используйте файл pb_schema.json"
echo "=============================================="
