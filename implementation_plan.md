# Переработка получения списка пользователей: GET → POST

Текущий `GET /users` принимает параметры фильтрации через query-строку (JSON-encoded строка `filters`).
Задача — переделать на `POST /users/list`, принимающий структурированное тело запроса с массивом фильтров нового формата.

## Формат нового запроса

```json
{
  "searchTerm": "",
  "filters": [
    {
      "key": "firstName",
      "operator": "contain",
      "value": "Иван"
    },
    {
      "key": "createdAt",
      "operator": "between",
      "value": "2026-01-01T00:00:00|2026-06-28T23:59:59"
    }
  ],
  "sort": "createdAt",
  "sortType": "DESC",
  "page": 1,
  "limit": 10
}
```

**Поддерживаемые ключи:** `firstName`, `lastName`, `email`, `patronymic`, `roleId`  
**Операторы по типу поля:**
- Строковые поля: `equal`, `not-equal`, `contain`, `not-contain`
- `roleId` (UUID): `equal`, `not-equal`
- Дата (`createdAt`): `less`, `more`, `between`
- Для `between` — значения через `|`: `"2026-01-01|2026-06-28"`

Все поля опциональны — если пусто, возвращаются все пользователи с пагинацией по умолчанию.

## Open Questions

> [!IMPORTANT]
> **Маршрут**: Предлагаю использовать `POST /users/list` (вместо `GET /users`).  
> Старый `GET /users` нужно **оставить или удалить**?  
> Если оставить — фронтенд может использовать оба. Если удалить — потребуется обновление фронтенда.

> [!WARNING]
> **Пагинация**: Поля `page` и `limit` выносятся в тело POST-запроса, а не остаются в query-строке — это отступление от стандартного REST, но соответствует структуре запроса из задания. Подтвердить?

## Proposed Changes

---

### DTO Layer

#### [NEW] `find-users-body.dto.ts`
Новый DTO для тела POST-запроса. Включает:
- `FilterItemDto` — один элемент фильтра с `key`, `operator`, `value`
- `FindUsersBodyDto` — основной DTO с `searchTerm`, `filters[]`, `sort`, `sortType`, `page`, `limit`

Валидация через `class-validator`:
- `filters` — массив объектов (`@IsArray`, `@ValidateNested`, `@Type`)
- `operator` — `@IsIn([...])` только допустимые значения
- `key` — `@IsIn([...])` только разрешённые поля
- `value` — `@IsString`, `@IsOptional`
- `sort`, `sortType`, `page`, `limit` — `@IsOptional`

#### [DELETE] `find-users-query.dto.ts` *(опционально)*
Если старый `GET /users` убирается — можно удалить. Иначе — оставить.

---

### Service Layer

#### [MODIFY] [users.service.ts](file:///d:/zen_projets/store-z/backend/src/users/users.service.ts)

Добавить новый метод `findAllByBody(body: FindUsersBodyDto)`:
- Итерируем `body.filters` и через `switch` на `key + operator` добавляем условия в QueryBuilder
- `between` — сплит по `|`, берём два значения
- `searchTerm` — ILIKE по `firstName | lastName | email`
- Сортировка по `body.sort` / `body.sortType`
- Пагинация: `body.page`, `body.limit`
- Возврат: `{ data, meta: { total, page, limit, pageCount } }`

Старый `findAll` — **оставляем без изменений** пока не будет подтверждён снос `GET /users`.

---

### Controller Layer

#### [MODIFY] [users.controller.ts](file:///d:/zen_projets/store-z/backend/src/users/users.controller.ts)

Добавить новый маршрут:
```
POST /users/list
```

```typescript
@Post('list')
@Permissions({ model: ModelNameEnum.USER, access: AccessEnum.READ })
@ApiOperation({ summary: 'Get users list with filters (POST)' })
findAllByBody(@Body() body: FindUsersBodyDto) {
    return this.usersService.findAllByBody(body);
}
```

> [!NOTE]
> Маршрут `POST /users/list` должен быть объявлен **до** `@Post()` (create), иначе NestJS может неверно его маршрутизировать. Фактически конфликта нет (разные пути), но порядок — хорошая практика.

---

## Verification Plan

### Automated Tests
- Нет автотестов в проекте — ручная проверка через Swagger / Postman.

### Manual Verification
1. `POST /users/list` без тела → возвращает первую страницу всех пользователей
2. `POST /users/list` с `searchTerm` → фильтрует по имени/email
3. `POST /users/list` с фильтром `contain` по `firstName` → корректный ILIKE
4. `POST /users/list` с фильтром `between` по `createdAt` → BETWEEN с двумя датами
5. `POST /users/list` с `roleId` фильтром → фильтрует по роли
6. `POST /users/list` с невалидным `operator` → `400 Bad Request`
