# Board UI Implementation Guide


## 📁 File Structure

```
resources/js/
├── layouts/
│   └── pinterest-layout.tsx       ← Reusable layout dengan sidebar
│
└── Pages/Boards/
    ├── Index.tsx                  ← Halaman list boards
    ├── Show.tsx                   ← Halaman detail board
    ├── CreateBoardModal.tsx       ← Modal create board
    └── BoardCard.tsx              ← Component card board
```

---

## 🚀 Routes

### Web Routes (Inertia)
```php
// resources/js/routes/web.php

GET  /boards           → Boards/Index.tsx    (list all boards)
GET  /boards/{id}      → Boards/Show.tsx     (board detail + pins)
```

### API Routes (Backend)
```php
POST   /api/boards                    → Create board
DELETE /api/boards/{id}               → Delete board
POST   /api/boards/{id}/pins          → Add pin to board
DELETE /api/boards/{id}/pins/{pin}    → Remove pin from board
```

---

## 🎯 Features

### 1. List Boards (`/boards`)

**Empty State:**
- Icon SVG
- "Organize your ideas" message
- "Create your first board" button

**Has Boards:**
- Grid layout (auto-fill, min 280px)
- Board cards dengan cover (up to 4 pins grid)
- Pins count
- Hover effect
- "Create board" card di akhir grid

**Actions:**
- Click card → Navigate ke detail board
- Click "..." menu → Delete board
- Click "Create" → Open modal

---

### 2. Board Detail (`/boards/{id}`)

**Header:**
- Board name (editable nanti)
- Description
- Pins count
- "Add pins" button
- "Back to boards" button

**Content:**
- Masonry grid (2-5 columns responsif)
- Pin images
- Hover: Remove button (X icon)

**Empty State:**
- Icon
- "No pins yet" message
- "Add your first pin" button

---

### 3. Create Board Modal

**Form Fields:**
- Name (required, max 255)
- Description (optional, max 1000)

**Validation:**
- Client-side: button disabled jika name kosong
- Server-side: Laravel Form Request

**Interaction:**
- Click outside/Cancel → Close modal
- Click Create → Submit ke `/api/boards`
- Success → Refresh list, close modal

---

### 4. Add Pins Modal

**Features:**
- Search pins (by title/description)
- Grid display available pins
- Filter: exclude pins already in board
- Click pin → Add to board

**Flow:**
1. User di halaman board detail
2. Click "Add pins"
3. Modal shows available pins
4. Search/filter pins
5. Click pin → POST `/api/boards/{id}/pins`
6. Success → Modal close, board refresh

---

### 5. Delete Board

**Flow:**
1. Click "..." menu pada board card
2. Click "Delete board"
3. Confirmation modal muncul
4. Click "Delete" → DELETE `/api/boards/{id}`
5. Success → Board removed from list

**Safety:**
- Confirmation dialog
- Warning message: "All pins will be permanently removed"

---

## 🎨 Design System

### Colors
```css
Primary (Red):    bg-red-600 hover:bg-red-700
Secondary (Gray): bg-gray-200 hover:bg-gray-300
Text Primary:     text-gray-900
Text Secondary:   text-gray-600
Border:           border-gray-200
```

### Spacing
```css
Container:  px-10 py-10
Cards gap:  gap-6 / gap-8
Modal:      p-6 / p-8
```

### Border Radius
```css
Buttons:  rounded-full
Cards:    rounded-2xl / rounded-xl
Modal:    rounded-2xl
Images:   rounded-2xl
```

### Typography
```css
Page Title:   text-4xl font-bold
Card Title:   text-lg font-semibold
Description:  text-sm / text-lg
```

---

## 💻 Usage Examples

### Navigate to Boards
```typescript
import { router } from "@inertiajs/react";

router.visit("/boards");
```

### Create Board
```typescript
import { useForm } from "@inertiajs/react";

const { data, setData, post } = useForm({
    name: "",
    description: ""
});

post("/api/boards", {
    onSuccess: () => {
        // Board created!
    }
});
```

### Delete Board
```typescript
import { router } from "@inertiajs/react";

router.delete(`/api/boards/${boardId}`);
```

### Add Pin to Board
```typescript
router.post(`/api/boards/${boardId}/pins`, {
    pin_id: pinId
});
```

### Remove Pin from Board
```typescript
router.delete(`/api/boards/${boardId}/pins/${pinId}`);
```

---

## 🧩 Component Props

### PinterestLayout
```typescript
interface PinterestLayoutProps {
    active: string;        // "boards" | "home" | "explore" etc
    children: ReactNode;
}
```

### BoardCard
```typescript
interface Board {
    id: number;
    name: string;
    description: string | null;
    pins_count: number;
    pins?: Array<{
        id: number;
        image_url: string;
        title: string;
    }>;
}
```

### CreateBoardModal
```typescript
interface CreateBoardModalProps {
    onClose: () => void;
}
```

---

## 🔄 Data Flow

### Index Page
```
Laravel → Inertia → Index.tsx
         boards: { data: Board[] }
```

### Show Page
```
Laravel → Inertia → Show.tsx
         board: { data: Board }
         availablePins: { data: Pin[] }
```

### Create/Delete
```
React → POST/DELETE → Laravel API
      → Success → Inertia refresh
```

---

