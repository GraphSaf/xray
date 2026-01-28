#!/usr/bin/env python3
"""
Автоматический deployer для ДОЗ-3
Устанавливает PocketBase и загружает frontend на сервер
"""

import os
import subprocess
import sys

SERVER = "85.198.86.169"
USER = "root"
PASSWORD = "f3vgEuWw3!cx"
REMOTE_DIR = "/var/www/doz3"
PB_DIR = "/opt/pocketbase"

def run_ssh_command(command, show_output=True):
    """Выполнить команду на удаленном сервере через SSH"""
    full_cmd = f'sshpass -p "{PASSWORD}" ssh -o StrictHostKeyChecking=no {USER}@{SERVER} "{command}"'

    try:
        result = subprocess.run(
            full_cmd,
            shell=True,
            capture_output=True,
            text=True,
            timeout=300
        )

        if show_output and result.stdout:
            print(result.stdout)
        if result.stderr:
            print(result.stderr, file=sys.stderr)

        return result.returncode == 0
    except subprocess.TimeoutExpired:
        print(f"⚠️ Timeout для команды: {command[:50]}...")
        return False
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        return False

def copy_file(local_path, remote_path):
    """Копировать файл на сервер"""
    cmd = f'sshpass -p "{PASSWORD}" scp -o StrictHostKeyChecking=no {local_path} {USER}@{SERVER}:{remote_path}'
    return subprocess.run(cmd, shell=True).returncode == 0

def copy_directory(local_dir, remote_dir):
    """Копировать директорию на сервер"""
    cmd = f'sshpass -p "{PASSWORD}" scp -r -o StrictHostKeyChecking=no {local_dir}/* {USER}@{SERVER}:{remote_dir}/'
    return subprocess.run(cmd, shell=True).returncode == 0

def main():
    print("🚀 Автоматический деплой ДОЗ-3 на xray.zubrdental.ru")
    print("=" * 60)

    # 1. Копирование скрипта установки
    print("\n📤 Копирование скрипта установки на сервер...")
    if not copy_file("full-deploy.sh", "/root/full-deploy.sh"):
        print("❌ Ошибка копирования скрипта")
        return 1

    # 2. Установка прав
    print("⚙️ Установка прав на выполнение...")
    run_ssh_command("chmod +x /root/full-deploy.sh")

    # 3. Запуск установки
    print("\n🔧 Запуск установки PocketBase и Nginx...")
    print("(это может занять несколько минут)")
    if not run_ssh_command("bash /root/full-deploy.sh"):
        print("⚠️ Установка завершена с предупреждениями")

    # 4. Копирование frontend
    print("\n📤 Копирование frontend файлов...")
    dist_path = os.path.join(os.path.dirname(__file__), "../dist")

    if not os.path.exists(dist_path):
        print(f"❌ Директория {dist_path} не найдена")
        print("Запустите: npm run build")
        return 1

    # Очистка старых файлов
    run_ssh_command(f"rm -rf {REMOTE_DIR}/*", show_output=False)

    # Копирование новых файлов
    if not copy_directory(dist_path, REMOTE_DIR):
        print("❌ Ошибка копирования frontend")
        return 1

    # 5. Проверка
    print("\n✅ Проверка сервисов...")
    run_ssh_command("systemctl is-active pocketbase")
    run_ssh_command("systemctl is-active nginx")

    print("\n" + "=" * 60)
    print("✅ Деплой завершен успешно!")
    print("=" * 60)
    print("\n📍 URL-адреса:")
    print(f"   Приложение: https://xray.zubrdental.ru/")
    print(f"   Admin UI:   https://xray.zubrdental.ru/_/")
    print(f"   API:        https://xray.zubrdental.ru/api/")
    print("\n📋 Следующие шаги:")
    print("   1. Откройте https://xray.zubrdental.ru/_/")
    print("   2. Создайте admin аккаунт")
    print("   3. Импортируйте схему коллекции из {PB_DIR}/pb_data/pb_schema.json")
    print("=" * 60)

    return 0

if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n\n❌ Деплой отменен пользователем")
        sys.exit(1)
