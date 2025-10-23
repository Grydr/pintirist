# Board API - Testing Examples

> Copy-paste ready commands untuk testing Board API (cross-platform)

---

## 🌍 Choose Your Testing Method

| Method | OS Support | Setup | Best For |
|--------|-----------|-------|----------|
| **Browser Console** | All | None (built-in) | Quick tests, no setup |
| **cURL + bash** | Linux, macOS, WSL, Git Bash | Pre-installed | Automation, CI/CD |
| **HTTPie** | All (pip install) | `pip install httpie` | Readable syntax |
| **PowerShell** | Windows | Built-in | Windows developers |
| **Python** | All | `pip install requests` | Python developers |
| **Node.js** | All | `npm install axios` | JS developers |
| **Postman/Insomnia** | All | Download app | GUI, collections |

**Recommendation**: Start with **Browser Console** for quick tests, use **cURL/Python/Node.js** for automation.

---

## 🚀 Quick Start

```bash
# 1. Verify routes exist
php artisan route:list --path=api/boards

# 2. (Optional) Seed sample data
php artisan db:seed --class=BoardSeeder
# Test user: test@example.com / password

# 3. Start server
php artisan serve
```

---

## 🌐 Browser Console Testing

Login ke app dulu, buka DevTools Console:

```javascript
// Helper function
const api = (url, options = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
      ...options.headers
    }
  }).then(r => r.json()).then(console.log);
};

// List boards
api('/api/boards');

// Create board
api('/api/boards', {
  method: 'POST',
  body: JSON.stringify({ name: 'Test Board', description: 'Testing' })
});

// Show board
api('/api/boards/1');

// Update board
api('/api/boards/1', {
  method: 'PUT',
  body: JSON.stringify({ name: 'Updated Name' })
});

// Save pin to board
api('/api/boards/1/pins', {
  method: 'POST',
  body: JSON.stringify({ pin_id: 5 })
});

// Remove pin from board
fetch('/api/boards/1/pins/5', {
  method: 'DELETE',
  headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content }
}).then(r => r.json()).then(console.log);

// Delete board
fetch('/api/boards/1', {
  method: 'DELETE',
  headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content }
}).then(r => r.json()).then(console.log);
```

---

## 💻 cURL Testing (Cross-platform)

### Setup Cookie File:
1. Login via browser
2. Open DevTools → Application/Storage → Cookies
3. Copy session cookie value
4. Create `cookies.txt`:
```
# Netscape HTTP Cookie File
localhost	FALSE	/	FALSE	0	laravel_session	your-session-value
localhost	FALSE	/	FALSE	0	XSRF-TOKEN	your-xsrf-token
```

### Full Test Script:

```bash
#!/bin/bash
# Save as test_boards.sh, run: bash test_boards.sh

BASE_URL="http://localhost:8000"
COOKIE_FILE="cookies.txt"

# Get CSRF token from meta tag after login
CSRF_TOKEN="your-csrf-token-here"

echo "=== Testing Board API ==="

# 1. List boards
echo -e "\n1. List Boards..."
curl -b "$COOKIE_FILE" "$BASE_URL/api/boards" | jq

# 2. Create board
echo -e "\n2. Create Board..."
BOARD_RESPONSE=$(curl -b "$COOKIE_FILE" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: $CSRF_TOKEN" \
  -d '{"name":"cURL Test Board","description":"Created via cURL"}' \
  "$BASE_URL/api/boards")
echo "$BOARD_RESPONSE" | jq
BOARD_ID=$(echo "$BOARD_RESPONSE" | jq -r '.data.id')
echo "Created board ID: $BOARD_ID"

# 3. Show board
echo -e "\n3. Show Board $BOARD_ID..."
curl -b "$COOKIE_FILE" "$BASE_URL/api/boards/$BOARD_ID" | jq

# 4. Update board
echo -e "\n4. Update Board $BOARD_ID..."
curl -b "$COOKIE_FILE" \
  -X PUT \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: $CSRF_TOKEN" \
  -d '{"name":"Updated cURL Board","description":"Updated via cURL"}' \
  "$BASE_URL/api/boards/$BOARD_ID" | jq

# 5. Save pin to board (if pin ID 1 exists)
echo -e "\n5. Save Pin to Board..."
curl -b "$COOKIE_FILE" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: $CSRF_TOKEN" \
  -d '{"pin_id":1}' \
  "$BASE_URL/api/boards/$BOARD_ID/pins" | jq

# 6. Remove pin from board
echo -e "\n6. Remove Pin from Board..."
curl -b "$COOKIE_FILE" \
  -X DELETE \
  -H "X-CSRF-TOKEN: $CSRF_TOKEN" \
  "$BASE_URL/api/boards/$BOARD_ID/pins/1" | jq

# 7. Delete board
echo -e "\n7. Delete Board $BOARD_ID..."
curl -b "$COOKIE_FILE" \
  -X DELETE \
  -H "X-CSRF-TOKEN: $CSRF_TOKEN" \
  "$BASE_URL/api/boards/$BOARD_ID" | jq

echo -e "\n=== All Tests Complete! ==="
```

### Individual cURL Commands:

```bash
# Setup
BASE_URL="http://localhost:8000"
CSRF_TOKEN="your-csrf-token"

# List boards
curl -b cookies.txt "$BASE_URL/api/boards"

# Create board
curl -b cookies.txt \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: $CSRF_TOKEN" \
  -d '{"name":"My Board","description":"Test"}' \
  "$BASE_URL/api/boards"

# Show board
curl -b cookies.txt "$BASE_URL/api/boards/1"

# Update board
curl -b cookies.txt \
  -X PUT \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: $CSRF_TOKEN" \
  -d '{"name":"Updated Name"}' \
  "$BASE_URL/api/boards/1"

# Save pin to board
curl -b cookies.txt \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: $CSRF_TOKEN" \
  -d '{"pin_id":5}' \
  "$BASE_URL/api/boards/1/pins"

# Remove pin from board
curl -b cookies.txt \
  -X DELETE \
  -H "X-CSRF-TOKEN: $CSRF_TOKEN" \
  "$BASE_URL/api/boards/1/pins/5"

# Delete board
curl -b cookies.txt \
  -X DELETE \
  -H "X-CSRF-TOKEN: $CSRF_TOKEN" \
  "$BASE_URL/api/boards/1"
```

### HTTPie Alternative (More readable):

```bash
# Install: pip install httpie

# List boards
http GET localhost:8000/api/boards Cookie:laravel_session=xxx

# Create board
http POST localhost:8000/api/boards \
  name="My Board" \
  description="Test" \
  Cookie:laravel_session=xxx \
  X-CSRF-TOKEN:your-token

# Update board
http PUT localhost:8000/api/boards/1 \
  name="Updated" \
  Cookie:laravel_session=xxx \
  X-CSRF-TOKEN:your-token
```

---

## 💻 PowerShell Testing (Windows)

### Full Test Script (Copy-paste semua):

```powershell
# Setup base URL
$base = "http://localhost:8000"

# Login dulu via browser, lalu jalankan ini untuk maintain session
Write-Host "`n=== Testing Board API ===" -ForegroundColor Cyan

# 1. List boards
Write-Host "`n1. List Boards..." -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "$base/api/boards" -UseBasicParsing -SessionVariable 'session'
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5

# 2. Create board
Write-Host "`n2. Create Board..." -ForegroundColor Yellow
$createBody = @{
    name = "PowerShell Test Board"
    description = "Created from PowerShell script"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$base/api/boards" `
    -Method POST `
    -Body $createBody `
    -ContentType "application/json" `
    -WebSession $session
$boardData = $response.Content | ConvertFrom-Json
$boardId = $boardData.data.id
Write-Host "Created board ID: $boardId" -ForegroundColor Green
$boardData | ConvertTo-Json -Depth 5

# 3. Show board
Write-Host "`n3. Show Board $boardId..." -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "$base/api/boards/$boardId" -WebSession $session
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5

# 4. Update board
Write-Host "`n4. Update Board $boardId..." -ForegroundColor Yellow
$updateBody = @{
    name = "Updated PowerShell Board"
    description = "Updated from PowerShell"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$base/api/boards/$boardId" `
    -Method PUT `
    -Body $updateBody `
    -ContentType "application/json" `
    -WebSession $session
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5

# 5. Save pin to board (assuming pin ID 1 exists)
Write-Host "`n5. Save Pin to Board..." -ForegroundColor Yellow
$pinBody = @{ pin_id = 1 } | ConvertTo-Json
try {
    $response = Invoke-WebRequest -Uri "$base/api/boards/$boardId/pins" `
        -Method POST `
        -Body $pinBody `
        -ContentType "application/json" `
        -WebSession $session
    $response.Content | ConvertFrom-Json | ConvertTo-Json
} catch {
    Write-Host "Note: Pin ID 1 might not exist. Create a pin first." -ForegroundColor Red
}

# 6. Remove pin from board
Write-Host "`n6. Remove Pin from Board..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$base/api/boards/$boardId/pins/1" `
        -Method DELETE `
        -WebSession $session
    $response.Content | ConvertFrom-Json | ConvertTo-Json
} catch {
    Write-Host "Note: Pin might not be attached." -ForegroundColor Red
}

# 7. Delete board
Write-Host "`n7. Delete Board $boardId..." -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "$base/api/boards/$boardId" `
    -Method DELETE `
    -WebSession $session
$response.Content | ConvertFrom-Json | ConvertTo-Json

Write-Host "`n=== All Tests Complete! ===" -ForegroundColor Green
```

### Individual Commands:

```powershell
# Initialize session
$base = "http://localhost:8000"
Invoke-WebRequest -Uri "$base/api/boards" -UseBasicParsing -SessionVariable 'session'

# List boards
Invoke-WebRequest -Uri "$base/api/boards" -WebSession $session | 
    Select-Object -ExpandProperty Content | ConvertFrom-Json

# Create board
$body = @{ name = "My Board"; description = "Test" } | ConvertTo-Json
Invoke-WebRequest -Uri "$base/api/boards" -Method POST -Body $body `
    -ContentType "application/json" -WebSession $session

# Show board
Invoke-WebRequest -Uri "$base/api/boards/1" -WebSession $session |
    Select-Object -ExpandProperty Content | ConvertFrom-Json

# Update board
$body = @{ name = "Updated"; description = "New" } | ConvertTo-Json
Invoke-WebRequest -Uri "$base/api/boards/1" -Method PUT -Body $body `
    -ContentType "application/json" -WebSession $session

# Delete board
Invoke-WebRequest -Uri "$base/api/boards/1" -Method DELETE -WebSession $session
```

---

## 🐍 Python Testing (Cross-platform)

### Using `requests` library:

```python
#!/usr/bin/env python3
# Install: pip install requests
# Run: python test_boards.py

import requests

BASE_URL = "http://localhost:8000"

# Login first via browser, then get session cookies
session = requests.Session()
session.cookies.set('laravel_session', 'your-session-cookie')
session.cookies.set('XSRF-TOKEN', 'your-xsrf-token')

# Get CSRF token
csrf_token = "your-csrf-token"
headers = {
    'X-CSRF-TOKEN': csrf_token,
    'Content-Type': 'application/json'
}

print("=== Testing Board API ===\n")

# 1. List boards
print("1. List Boards...")
response = session.get(f"{BASE_URL}/api/boards")
print(response.json())

# 2. Create board
print("\n2. Create Board...")
data = {"name": "Python Test Board", "description": "Created via Python"}
response = session.post(f"{BASE_URL}/api/boards", json=data, headers=headers)
board = response.json()
print(board)
board_id = board['data']['id']

# 3. Show board
print(f"\n3. Show Board {board_id}...")
response = session.get(f"{BASE_URL}/api/boards/{board_id}")
print(response.json())

# 4. Update board
print(f"\n4. Update Board {board_id}...")
data = {"name": "Updated Python Board", "description": "Updated"}
response = session.put(f"{BASE_URL}/api/boards/{board_id}", json=data, headers=headers)
print(response.json())

# 5. Save pin to board
print(f"\n5. Save Pin to Board...")
data = {"pin_id": 1}
response = session.post(f"{BASE_URL}/api/boards/{board_id}/pins", json=data, headers=headers)
print(response.json())

# 6. Remove pin from board
print(f"\n6. Remove Pin from Board...")
response = session.delete(f"{BASE_URL}/api/boards/{board_id}/pins/1", headers=headers)
print(response.json())

# 7. Delete board
print(f"\n7. Delete Board {board_id}...")
response = session.delete(f"{BASE_URL}/api/boards/{board_id}", headers=headers)
print(response.json())

print("\n=== All Tests Complete! ===")
```

---

## 📦 Node.js Testing (Cross-platform)

### Using `axios`:

```javascript
#!/usr/bin/env node
// Install: npm install axios
// Run: node test_boards.js

const axios = require('axios');

const BASE_URL = 'http://localhost:8000';
const CSRF_TOKEN = 'your-csrf-token';

// Create axios instance with cookies
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN': CSRF_TOKEN,
    'Cookie': 'laravel_session=your-session; XSRF-TOKEN=your-token'
  }
});

async function testBoardAPI() {
  console.log('=== Testing Board API ===\n');

  try {
    // 1. List boards
    console.log('1. List Boards...');
    let response = await api.get('/api/boards');
    console.log(response.data);

    // 2. Create board
    console.log('\n2. Create Board...');
    response = await api.post('/api/boards', {
      name: 'Node.js Test Board',
      description: 'Created via Node.js'
    });
    console.log(response.data);
    const boardId = response.data.data.id;

    // 3. Show board
    console.log(`\n3. Show Board ${boardId}...`);
    response = await api.get(`/api/boards/${boardId}`);
    console.log(response.data);

    // 4. Update board
    console.log(`\n4. Update Board ${boardId}...`);
    response = await api.put(`/api/boards/${boardId}`, {
      name: 'Updated Node.js Board',
      description: 'Updated'
    });
    console.log(response.data);

    // 5. Save pin to board
    console.log(`\n5. Save Pin to Board...`);
    response = await api.post(`/api/boards/${boardId}/pins`, {
      pin_id: 1
    });
    console.log(response.data);

    // 6. Remove pin from board
    console.log(`\n6. Remove Pin from Board...`);
    response = await api.delete(`/api/boards/${boardId}/pins/1`);
    console.log(response.data);

    // 7. Delete board
    console.log(`\n7. Delete Board ${boardId}...`);
    response = await api.delete(`/api/boards/${boardId}`);
    console.log(response.data);

    console.log('\n=== All Tests Complete! ===');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testBoardAPI();
```

---

## 📮 Postman Collection

### Setup:
1. Create new collection "Pintirist Boards"
2. Set collection variable: `baseUrl` = `http://localhost:8000`
3. Login via browser, copy cookies to Postman

### Requests:

**1. List Boards**
```
GET {{baseUrl}}/api/boards
```

**2. Create Board**
```
POST {{baseUrl}}/api/boards
Body (JSON):
{
  "name": "My Board",
  "description": "Optional description"
}
```

**3. Show Board**
```
GET {{baseUrl}}/api/boards/1
```

**4. Update Board**
```
PUT {{baseUrl}}/api/boards/1
Body (JSON):
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

**5. Delete Board**
```
DELETE {{baseUrl}}/api/boards/1
```

**6. Save Pin to Board**
```
POST {{baseUrl}}/api/boards/1/pins
Body (JSON):
{
  "pin_id": 5
}
```

**7. Remove Pin from Board**
```
DELETE {{baseUrl}}/api/boards/1/pins/5
```

---

## ✅ Test Checklist

Jalankan test ini secara berurutan:

```
[ ] 1. List boards (should return empty or existing boards)
[ ] 2. Create board (should return 201 with board data)
[ ] 3. List boards again (should show new board)
[ ] 4. Show board detail (should return board with pins)
[ ] 5. Update board (should return 200 with updated data)
[ ] 6. Create a pin first (if needed for next tests)
[ ] 7. Save pin to board (should return 201)
[ ] 8. Show board (should include the pin)
[ ] 9. Remove pin from board (should return 200)
[ ] 10. Show board (should not include the pin)
[ ] 11. Delete board (should return 200)
[ ] 12. List boards (should not show deleted board)
```

---

## 🐛 Common Issues

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthenticated | No session cookie | Login via browser first |
| 403 Forbidden | Not board owner | Use your own boards |
| 404 Not Found | Invalid ID | Check board/pin exists |
| 422 Validation | Missing fields | Check request body |
| CSRF mismatch | Missing token | Include X-CSRF-TOKEN header |

---

## 📊 Expected Responses

### Success (List):
```json
{
  "data": [{ "id": 1, "name": "Board", "pins_count": 5 }],
  "meta": { "current_page": 1, "per_page": 12, "total": 1 }
}
```

### Success (Create):
```json
{
  "data": { "id": 2, "name": "New Board", "pins_count": 0 },
  "message": "Board created"
}
```

### Error (Validation):
```json
{
  "message": "The name field is required.",
  "errors": { "name": ["The name field is required."] }
}
```

---

## 📝 Notes

- **Session Required**: Login via browser before testing
- **CSRF Protection**: Include token for web routes
- **Pagination**: Default 12 items per page
- **Duplicate Prevention**: Pins won't be attached twice
- **Owner Only**: Can only manage your own boards

For complete API documentation, see `BOARDS_BACKEND.md`
