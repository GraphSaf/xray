#!/bin/bash
# Быстрая установка PocketBase на xray.zubrdental.ru
# Запустите эту команду на сервере: bash <(curl -s https://raw.githubusercontent.com/GraphSaf/xray/main/deploy/quick-install.sh)

set -e

DOMAIN="xray.zubrdental.ru"
PB_VERSION="0.22.20"
PB_DIR="/opt/pocketbase"
EMAIL="admin@zubrdental.ru"

echo "🚀 Установка PocketBase"
echo "======================="

# Обновление системы
apt update -qq
apt install -y nginx certbot python3-certbot-nginx unzip curl > /dev/null 2>&1

# Скачивание PocketBase
echo "📥 Скачивание PocketBase..."
mkdir -p ${PB_DIR}
cd ${PB_DIR}
curl -sL "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip" -o pb.zip
unzip -oq pb.zip && rm pb.zip
chmod +x pocketbase

# Systemd service
echo "⚙️ Настройка service..."
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

systemctl daemon-reload
systemctl enable pocketbase > /dev/null 2>&1
systemctl start pocketbase

# Nginx config
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

ln -sf /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/
nginx -t > /dev/null 2>&1 && systemctl reload nginx

# SSL
echo "🔒 Установка SSL..."
certbot --nginx -d ${DOMAIN} --non-interactive --agree-tos --email ${EMAIL} --redirect

# Создание схемы коллекции
echo "📋 Создание схемы БД..."
cat > ${PB_DIR}/pb_data/schema.json <<'SCHEMA'
[
  {
    "id": "doz3_reports_id",
    "name": "doz3_reports",
    "type": "base",
    "system": false,
    "schema": [
      {"name": "organizationName", "type": "text", "required": true},
      {"name": "organizationAddress", "type": "text", "required": true},
      {"name": "organizationOKPO", "type": "text", "required": true},
      {"name": "responsibleName", "type": "text", "required": true},
      {"name": "responsiblePosition", "type": "text", "required": true},
      {"name": "responsiblePhone", "type": "text", "required": true},
      {"name": "periodYear", "type": "number", "required": true},
      {"name": "periodQuarter", "type": "number", "required": false},
      {"name": "procedures", "type": "json", "required": true},
      {"name": "totalDose_personmGy", "type": "number", "required": true},
      {"name": "status", "type": "select", "required": true, "options": {"values": ["draft", "completed", "archived"]}}
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": ""
  }
]
SCHEMA

echo ""
echo "✅ Установка завершена!"
echo "======================="
echo "🌐 PocketBase: https://${DOMAIN}"
echo "🔧 Admin: https://${DOMAIN}/_/"
echo ""
echo "Следующие шаги:"
echo "1. Откройте https://${DOMAIN}/_/"
echo "2. Создайте admin аккаунт"
echo "3. Импортируйте коллекцию из ${PB_DIR}/pb_data/schema.json"
echo "   (Settings → Import collections → Load from file)"
