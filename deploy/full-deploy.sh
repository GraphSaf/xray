#!/bin/bash
# Полный деплой ДОЗ-3: Frontend + PocketBase на одном сервере
set -e

DOMAIN="xray.zubrdental.ru"
PB_VERSION="0.22.20"
PB_DIR="/opt/pocketbase"
WEB_DIR="/var/www/doz3"
EMAIL="admin@zubrdental.ru"

echo "🚀 Полный деплой на ${DOMAIN}"
echo "======================================"

# 1. Обновление системы и установка пакетов
echo "📦 Установка необходимых пакетов..."
apt update -qq
apt install -y nginx certbot python3-certbot-nginx unzip curl

# 2. Установка PocketBase
echo "📥 Установка PocketBase..."
mkdir -p ${PB_DIR}
cd ${PB_DIR}
curl -sL "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip" -o pb.zip
unzip -oq pb.zip && rm pb.zip
chmod +x pocketbase

# 3. Systemd service для PocketBase
echo "⚙️ Настройка PocketBase service..."
cat > /etc/systemd/system/pocketbase.service <<'EOF'
[Unit]
Description=PocketBase Backend
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
systemctl enable pocketbase
systemctl restart pocketbase
sleep 2

# 4. Создание директории для frontend
echo "📁 Подготовка директории для frontend..."
mkdir -p ${WEB_DIR}

# 5. Настройка Nginx
echo "🌐 Настройка Nginx..."
cat > /etc/nginx/sites-available/${DOMAIN} <<'NGINXCONF'
server {
    listen 80;
    server_name xray.zubrdental.ru;

    root /var/www/doz3;
    index index.html;

    # Максимальный размер загружаемых файлов
    client_max_body_size 10M;

    # Frontend - статические файлы React
    location / {
        try_files $uri $uri/ /index.html;

        # Кеширование статических ресурсов
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # PocketBase API
    location /api/ {
        proxy_pass http://127.0.0.1:8090/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # PocketBase Admin UI
    location /_/ {
        proxy_pass http://127.0.0.1:8090/_/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Файлы PocketBase
    location /api/files/ {
        proxy_pass http://127.0.0.1:8090/api/files/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINXCONF

# Активация конфига
ln -sf /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# 6. SSL сертификат
echo "🔒 Установка SSL сертификата..."
certbot --nginx -d ${DOMAIN} --non-interactive --agree-tos --email ${EMAIL} --redirect

# 7. Создание схемы БД для PocketBase
echo "📋 Создание схемы коллекции..."
cat > ${PB_DIR}/pb_data/pb_schema.json <<'SCHEMA'
[
  {
    "name": "doz3_reports",
    "type": "base",
    "system": false,
    "schema": [
      {"name": "organizationName", "type": "text", "required": true, "options": {"min": 1, "max": 255}},
      {"name": "organizationAddress", "type": "text", "required": true, "options": {"min": 1, "max": 500}},
      {"name": "organizationOKPO", "type": "text", "required": true, "options": {"min": 1, "max": 20}},
      {"name": "responsibleName", "type": "text", "required": true, "options": {"min": 1, "max": 255}},
      {"name": "responsiblePosition", "type": "text", "required": true, "options": {"min": 1, "max": 255}},
      {"name": "responsiblePhone", "type": "text", "required": true, "options": {"min": 1, "max": 50}},
      {"name": "periodYear", "type": "number", "required": true, "options": {"min": 2000, "max": 2100}},
      {"name": "periodQuarter", "type": "number", "required": false, "options": {"min": 1, "max": 4}},
      {"name": "procedures", "type": "json", "required": true},
      {"name": "totalDose_personmGy", "type": "number", "required": true, "options": {"min": 0}},
      {"name": "status", "type": "select", "required": true, "options": {"maxSelect": 1, "values": ["draft", "completed", "archived"]}}
    ],
    "indexes": [
      "CREATE INDEX idx_period ON doz3_reports (periodYear, periodQuarter)",
      "CREATE INDEX idx_status ON doz3_reports (status)"
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": ""
  }
]
SCHEMA

# 8. Информация о деплое
echo ""
echo "✅ Базовая установка завершена!"
echo "======================================"
echo "Сервер готов принять frontend файлы"
echo ""
echo "📍 Структура:"
echo "   Frontend:   https://${DOMAIN}/"
echo "   API:        https://${DOMAIN}/api/"
echo "   Admin UI:   https://${DOMAIN}/_/"
echo ""
echo "📁 Директории:"
echo "   Frontend:   ${WEB_DIR}"
echo "   PocketBase: ${PB_DIR}"
echo ""
echo "Следующие шаги:"
echo "1. Загрузите frontend файлы в ${WEB_DIR}"
echo "2. Откройте https://${DOMAIN}/_/"
echo "3. Создайте admin аккаунт"
echo "4. Импортируйте коллекцию из ${PB_DIR}/pb_data/pb_schema.json"
echo "======================================"
