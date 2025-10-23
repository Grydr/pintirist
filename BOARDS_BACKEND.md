# Board Backend API - Complete Guide




## 📋 Quick Reference

### API Endpoints (7 total)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/boards` | List user's boards (paginated) | Required |
| POST | `/api/boards` | Create new board | Required |
| GET | `/api/boards/{board}` | Show board with pins | Owner |
| PUT | `/api/boards/{board}` | Update board | Owner |
| DELETE | `/api/boards/{board}` | Delete board | Owner |
| POST | `/api/boards/{board}/pins` | Save pin to board | Owner |
| DELETE | `/api/boards/{board}/pins/{pin}` | Remove pin from board | Owner |

### Files Created

```
app/Http/Controllers/Api/
├── BoardApiController.php       (CRUD operations)
└── BoardPinApiController.php    (Pin attach/detach)

app/Http/Requests/
├── StoreBoardRequest.php        (Validation)
├── UpdateBoardRequest.php       (Validation)
└── AttachPinRequest.php         (Validation)

app/Http/Resources/
├── BoardResource.php            (JSON format)
└── PinResource.php              (JSON format)

app/Policies/
└── BoardPolicy.php              (Authorization)

database/seeders/
└── BoardSeeder.php              (Sample data - optional)
```

---

## 🚀 Quick Start

### 1. Verify Routes
```bash
php artisan route:list --path=api/boards
# Should show 7 routes
```

### 2. (Optional) Seed Sample Data
```bash
php artisan db:seed --class=BoardSeeder
# Creates test user: test@example.com / password
```

### 3. Start Server & Test
```bash
php artisan serve
# Open http://localhost:8000, login, then test API
```

### 4. Test via Browser Console
```javascript
// List boards
fetch('/api/boards').then(r => r.json()).then(console.log);

// Create board
fetch('/api/boards', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
  },
  body: JSON.stringify({
    name: 'My Board',
    description: 'Description'
  })
}).then(r => r.json()).then(console.log);
```

---

## 📖 API Documentation

### 1. List Boards
**GET** `/api/boards`

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": 1,
      "name": "My Board",
      "description": "Board description",
      "user_id": 1,
      "pins_count": 5,
      "created_at": "2025-10-23T10:00:00.000000Z"
    }
  ],
  "links": { "first": "...", "last": "...", "prev": null, "next": null },
  "meta": { "current_page": 1, "per_page": 12, "total": 1 }
}
```

---

### 2. Create Board
**POST** `/api/boards`

**Request**:
```json
{
  "name": "Board Name",          // required, max:255
  "description": "Description"   // optional, max:1000
}
```

**Response** (201 Created):
```json
{
  "data": {
    "id": 2,
    "name": "Board Name",
    "description": "Description",
    "user_id": 1,
    "pins_count": 0,
    "created_at": "2025-10-23T11:00:00.000000Z"
  },
  "message": "Board created"
}
```

---

### 3. Show Board
**GET** `/api/boards/{board}`

**Response** (200 OK):
```json
{
  "data": {
    "id": 1,
    "name": "My Board",
    "description": "Description",
    "user_id": 1,
    "pins_count": 2,
    "pins": [
      {
        "id": 5,
        "image_url": "https://example.com/image.jpg",
        "title": "Pin Title",
        "description": "Pin description",
        "user_id": 1,
        "created_at": "2025-10-23T10:00:00.000000Z"
      }
    ],
    "created_at": "2025-10-23T10:00:00.000000Z"
  }
}
```

---

### 4. Update Board
**PUT** `/api/boards/{board}`

**Request**:
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Response** (200 OK):
```json
{
  "data": { /* board data */ },
  "message": "Board updated"
}
```

---

### 5. Delete Board
**DELETE** `/api/boards/{board}`

**Response** (200 OK):
```json
{
  "message": "Board deleted"
}
```

---

### 6. Save Pin to Board
**POST** `/api/boards/{board}/pins`

**Request**:
```json
{
  "pin_id": 5  // required, must exist in pins table
}
```

**Response** (201 Created):
```json
{
  "message": "Pin saved to board"
}
```

**Note**: Duplicate pins are automatically prevented.

---

### 7. Remove Pin from Board
**DELETE** `/api/boards/{board}/pins/{pin}`

**Response** (200 OK):
```json
{
  "message": "Pin removed from board"
}
```

---

## ❌ Error Responses

### 401 Unauthorized (Not logged in)
```json
{
  "message": "Unauthenticated."
}
```

### 403 Forbidden (Not owner)
```json
{
  "message": "This action is unauthorized."
}
```

### 404 Not Found
```json
{
  "message": "No query results for model [App\\Models\\Board] 99"
}
```

### 422 Validation Error
```json
{
  "message": "The name field is required.",
  "errors": {
    "name": ["The name field is required."]
  }
}
```

---

## 🧪 Testing with Postman/Insomnia

### Setup:
1. Login via browser first (to get session cookie)
2. Copy session cookie from browser DevTools
3. Import cookie to Postman/Insomnia
4. Set base URL: `http://localhost:8000`

### Test Endpoints:
```
GET    /api/boards              → List all boards
POST   /api/boards              → Create board
GET    /api/boards/1            → Show board #1
PUT    /api/boards/1            → Update board #1
DELETE /api/boards/1            → Delete board #1
POST   /api/boards/1/pins       → Save pin to board #1
DELETE /api/boards/1/pins/5     → Remove pin #5 from board #1
```

### cURL Testing (Cross-platform):
```bash
# After login, save cookies from browser to cookies.txt
# Then use -b flag to send cookies with each request

# List boards
curl -b cookies.txt http://localhost:8000/api/boards

# Create board
curl -b cookies.txt \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: your-csrf-token" \
  -d '{"name":"Test Board","description":"Testing"}' \
  http://localhost:8000/api/boards

# Show board
curl -b cookies.txt http://localhost:8000/api/boards/1

# Update board
curl -b cookies.txt \
  -X PUT \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: your-csrf-token" \
  -d '{"name":"Updated Name"}' \
  http://localhost:8000/api/boards/1

# Save pin to board
curl -b cookies.txt \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: your-csrf-token" \
  -d '{"pin_id":5}' \
  http://localhost:8000/api/boards/1/pins

# Delete board
curl -b cookies.txt \
  -X DELETE \
  -H "X-CSRF-TOKEN: your-csrf-token" \
  http://localhost:8000/api/boards/1
```

---

## 🔐 Security Features

- ✅ **Session Authentication** - Fortify session-based auth
- ✅ **Policy Authorization** - Owner verification via `BoardPolicy`
- ✅ **Input Validation** - Form Requests for all POST/PUT
- ✅ **Duplicate Prevention** - Auto-check before attaching pins
- ✅ **CSRF Protection** - Required for web routes

---

## 🎯 Implementation Details

### Controller Logic

**BoardApiController**:
- `index()` - Paginated list (12 per page) with `pins_count`
- `store()` - Create board for authenticated user
- `show()` - Load board with pins (latest first) and user
- `update()` - Update board with policy check
- `destroy()` - Delete board with policy check

**BoardPinApiController**:
- `store()` - Attach pin with duplicate check
- `destroy()` - Detach pin from board

### Validation Rules

**StoreBoardRequest / UpdateBoardRequest**:
- `name`: required, string, max:255
- `description`: nullable, string, max:1000

**AttachPinRequest**:
- `pin_id`: required, integer, exists:pins,id

### Policy Rules

**BoardPolicy**:
- `view()` - Owner only (can be changed for public boards)
- `update()` - Owner only
- `delete()` - Owner only

### Model Relations

**Board** → `pins()`: belongsToMany(Pin, 'board_pin')  
**Pin** → `boards()`: belongsToMany(Board, 'board_pin')  
**User** → `boards()`: hasMany(Board)

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Unauthenticated" | Login via browser first, ensure cookies are sent |
| "No query results" | Board/Pin ID doesn't exist, check data first |
| "pin_id required" | Include valid `pin_id` in request body |
| CSRF Token Mismatch | Include `X-CSRF-TOKEN` header with meta token |
| 403 Forbidden | You're not the owner, use your own boards |

---

## ✅ Implementation Checklist

- [x] 7 API endpoints
- [x] 2 Controllers (Board, BoardPin)
- [x] 3 Form Requests (validation)
- [x] 2 API Resources (JSON formatting)
- [x] 1 Policy (authorization)
- [x] 1 Seeder (optional sample data)
- [x] Model relations updated
- [x] No syntax errors
- [x] Routes verified
- [x] Documentation complete

---

## 📝 Next Steps (Future)

### For Testing:
- [ ] Write Feature tests (`tests/Feature/BoardApiTest.php`)
- [ ] Test all edge cases
- [ ] Load testing

### For Frontend:
- [ ] Create Inertia React components (TSX)
- [ ] Consume API endpoints
- [ ] Build UI/UX with Tailwind CSS
- [ ] Handle loading states

### Optional Features:
- [ ] Image upload for pins (`php artisan storage:link`)
- [ ] Public/private boards (`is_public` column)
- [ ] Board search/filter endpoint
- [ ] Board sharing/collaboration
- [ ] Pin reordering in boards

---

