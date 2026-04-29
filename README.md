1. `backend/docker-init-scripts/01-init.sql` - SQL скрипт с CREATE SEQUENCE
2. Обновлён `docker-compose.yml` - монтирует папку в `/docker-entrypoint-initdb.d`

Теперь при первом запуске БД автоматически выполнятся все `.sql` файлы из этой папки.

Чтобы добавить больше скриптов - просто создай файлы в `backend/docker-init-scripts/` с расширением `.sql` (например `02-users.sql`, `03-products.sql`).

**Важно:** Скрипты выполнятся только при **первом** запуске контейнера (когда том `postgres-data` пустой). Если БД уже запускалась, нужно удалить том:
```bash
docker-compose down -v
docker-compose up -d
```