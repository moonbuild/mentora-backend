# Mentora API Documentation

Base URL: `http://localhost:${PORT}`

All endpoints except `/auth/login`, `/auth/signup`, and `/auth/refresh` require a valid JWT access token in the request header:

```
Authorization: Bearer <access_token>
```

---

## Table of Contents

- [Auth](#auth)
- [General](#general)
- [Students](#students)
- [Lessons](#lessons)
- [Bookings](#bookings)
- [LLM](#llm)

---

## Auth

### POST /auth/signup

Register a new account. Only `parent` and `mentor` roles can self-register. Students are created by parents via `POST /students`.

**Auth required:** No

**Request body:**
```json
{
  "username": "moonbuild",
  "password": "Mourya123@",
  "role": "parent",
  "first_name": "Mourya",
  "last_name": "Pranay"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `username` | string | ✅ | Must be unique |
| `password` | string | ✅ | Will be hashed before storage |
| `role` | string | ✅ | `parent` or `mentor` only |
| `first_name` | string | ✅ | |
| `last_name` | string | ✅ | |

**Response `201`:**
```json
{
  "accessToken": "<jwt_access_token>",
  "refreshToken": "<jwt_refresh_token>"
}
```

**Errors:**

| Code | Reason |
|---|---|
| `400` | Missing required fields |
| `409` | Username already taken |

---

### POST /auth/login

Authenticate a user and receive access and refresh tokens.

**Auth required:** No

**Request body:**
```json
{
  "username": "moonbuild",
  "password": "Mourya123@"
}
```

**Response `200`:**
```json
{
  "accessToken": "<jwt_access_token>",
  "refreshToken": "<jwt_refresh_token>"
}
```

> Access token expires in **60 minutes**. Refresh token expires in **7 days**.

**Errors:**

| Code | Reason |
|---|---|
| `400` | Bad Request by Client |
| `401` | Invalid credentials |

---

### POST /auth/refresh

Exchange a valid refresh token for a new access token.

**Auth required:** No

**Request body:**
```json
{
  "refreshToken": "<refresh_token>"
}
```

**Response `200`:**
```json
{
  "accessToken": "<new_jwt_access_token>",
  "refreshToken": "<new_jwt_refresh_token>"
}
```

**Errors:**

| Code | Reason |
|---|---|
| `400` | Missing refresh token |
| `403` | Invalid or expired refresh token |

---

## General

### GET /

Health check / welcome route.

**Auth required:** No

**Response `200`:**
```json
{
  "message": "The School API is online"
}
```

---

### GET /health

Returns service health status.

**Auth required:** No

**Response `200`:**
```json
{
  "status":"ok",
  "uptime":41.3942646
}
```

---

### GET /me

Returns the profile of the currently authenticated user.

**Auth required:** Yes (any role)

**Response `200`:**
```json
{
  "user_id": "clx...",
  "username": "moonbuild",
  "role": "parent",
  "first_name": "Mourya",
  "last_name": "Pranay"
}
```

**Errors:**

| Code | Reason |
|---|---|
| `401` | Missing or invalid access token |

---

## Students

### POST /students

Create a student account under the authenticated parent.

**Auth required:** Yes - `parent` only

**Request body:**
```json
{
  "username": "student12",
  "password": "Mourya123@",
  "first_name": "Student",
  "last_name": "Book"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `username` | string | ✅ | Must be unique |
| `password` | string | ✅ | Will be hashed |
| `first_name` | string | ✅ | |
| `last_name` | string | ✅ | |

**Response `201`:**
```json
{
  "user_id": "clx...",
  "username": "student12",
  "role": "student",
  "first_name": "Student",
  "last_name": "Book",
}
```

**Errors:**

| Code | Reason |
|---|---|
| `400` | Missing or Invalid fields  |
| `401` | Not authenticated |
| `403` | Caller is not a parent |
| `409` | Username already taken |

---

### GET /students

Fetch all students belonging to the parent.

**Auth required:** Yes - `parent` only

**Response `200`:**
```json
[
  {
    "user_id": "clx...",
    "username": "student12",
    "first_name": "Student",
    "last_name": "Book",
  }
]
```

**Errors:**

| Code | Reason |
|---|---|
| `401` | Not authenticated |
| `403` | Caller is not a parent |

---

## Lessons

### POST /lessons

Create a new lesson. Only mentors can create lessons.

**Auth required:** Yes - `mentor` only

**Request body:**
```json
{
  "title": "Introduction to Algebra I",
  "description": "Basic algebraic concepts and equations."
}
```

| Field | Type | Required |
|---|---|---|
| `title` | string | ✅ |
| `description` | string | ✅ |

> `mentorId` is derived from the authenticated user.

**Response `201`:**
```json
{
  "lesson_id": "clx...",
  "title": "Introduction to Algebra I",
  "description": "Basic algebraic concepts and equations.",
  "mentor_id": "clx..."
}
```

**Errors:**

| Code | Reason |
|---|---|
| `400` | Missing title or description |
| `401` | Not authenticated |
| `403` | Caller is not a mentor |

---

### GET /lessons

Fetch all lessons on the platform. Accessible to parents and mentors only.

**Auth required:** Yes - `parent` or `mentor`

**Response `200`:**
```json
[
  {
    "lesson_id": "clx...",
    "title": "Introduction to Algebra I",
    "description": "Basic algebraic concepts and equations.",
    "mentor_id": "clx..."
  }
]
```

**Errors:**

| Code | Reason |
|---|---|
| `401` | Not authenticated |
| `403` | Students cannot access this endpoint |

---

### GET /lessons/mentor

Fetch all lessons created by the authenticated mentor.

**Auth required:** Yes - `mentor` only

**Response `200`:**
```json
[
  {
    "lesson_id": "clx...",
    "title": "Introduction to Algebra I",
    "description": "Basic algebraic concepts and equations.",
    "mentor_id": "clx..."
  }
]
```

**Errors:**

| Code | Reason |
|---|---|
| `401` | Not authenticated |
| `403` | Caller is not a mentor |

---

### POST /lessons/:lessonId/sessions

Create a session under a specific lesson. Only mentors can create sessions.

**Auth required:** Yes - `mentor` only

**URL params:**

| Param | Description |
|---|---|
| `lessonId` | ID of the lesson this session belongs to |

**Request body:**
```json
{
  "topic": "Solving for X",
  "date": "2025-03-13T10:00:00.000Z",
  "summary": "Students will learn how to isolate variables."
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `topic` | string | ✅ | |
| `date` | string (ISO 8601) | ✅ | e.g. `new Date().toISOString()` |
| `summary` | string | ✅ | |

**Response `201`:**
```json
{
  "session_id": "clx...",
  "lesson_id": "clx...",
  "topic": "Solving for X",
  "date": "2025-03-13T10:00:00.000Z",
  "summary": "Students will learn how to isolate variables."
}
```

**Errors:**

| Code | Reason |
|---|---|
| `400` | Missing required fields |
| `401` | Not authenticated |
| `403` | Caller is not a mentor |
| `404` | Lesson not found |

---

### GET /lessons/:lessonId/sessions

Fetch all sessions for a specific lesson. Accessible to any authenticated user.

**Auth required:** Yes (any role)

**URL params:**

| Param | Description |
|---|---|
| `lessonId` | ID of the lesson |

**Response `200`:**
```json
[
  {
    "session_id": "clx...",
    "topic": "Solving for X",
    "date": "2025-03-13T10:00:00.000Z",
    "summary": "Students will learn how to isolate variables."
  }
]
```

**Errors:**

| Code | Reason |
|---|---|
| `401` | Not authenticated |


---

## Bookings

### POST /bookings

Assign a student to a lesson. Only parents can create bookings, and only for students they own.

**Auth required:** Yes - `parent` only

**Request body:**
```json
{
  "studentId": "clx...",
  "lessonId": "clx..."
}
```

| Field | Type | Required |
|---|---|---|
| `studentId` | string | ✅ |
| `lessonId` | string | ✅ |

**Response `201`:**
```json
{
  "booking_id": "clx...",
  "student_profile_id": "clx...",
  "lesson_id": "clx..."
}
```

**Errors:**

| Code | Reason |
|---|---|
| `400` | Missing studentId or lessonId |
| `401` | Not authenticated |
| `403` | Caller is not a parent, or student does not belong to this parent |
| `409` | Student is already registed to lesson |

---

### GET /bookings

Fetch bookings. Parents see all bookings for their students. Students see only their own bookings.

**Auth required:** Yes - `parent` or `student`

**Response `200`:**
```json
[
  {
    "booking_id": "clx...",
    "lesson_id": "clx...",
    "student_profile_id": "clx...",
    "lesson": {
      "title": "Introduction to Algebra I",
      "description": "Basic algebraic concepts and equations.",
      "mentor": {
        "first_name": "Mourya",
        "last_name": "Pranay"
      }
    },
    "student_profile": {
      "student_user": {
        "first_name": "Student",
        "last_name": "Book"
      }
    }
  }

]
```

**Errors:**

| Code | Reason |
|---|---|
| `401` | Not authenticated |
| `403` | Mentors cannot access bookings |

---

## LLM

### POST /llm/summarize

Summarize a block of text using an LLM. Returns a concise summary in bullet points or a short paragraph.

**Auth required:** Yes (any role)

> **Rate limited.** Excessive requests(>5) within a short window (1min) will be rejected

**Request body:**
```json
{
  "text": "Your long text to summarize goes here..."
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `text` | string | ✅ | Min 50 chars, Max 9,000 chars |

**Response `200`:**
```json
{
  "summary": "A mindset refers to a set of attitudes and values that s....",
  "model": "llama3-8b-8192"
}
```

**Errors:**

| Code | Reason |
|---|---|
| `400` | `text` is missing or empty |
| `400` | `text` is too short (< 50 characters) |
| `413` | `text` exceeds the maximum allowed length |
| `429` | Rate limit exceeded |
| `502` | LLM provider returned an error |
| `500` | Unexpected server error |

**Example curl request:**


## Testing the API
 
A set of ready to run fetch scripts is available in the `/scripts` folder one file per endpoint.
 
```
📂scripts
```
 
To run a script, open the file, paste access token (and any required ids) then run:
 
```bash
node scripts/general/health.get.js
```
 
> Scripts that hit protected endpoints have a `// paste the access token here` comment above the `accessToken` variable. Get a token first by running `node scripts/auth.login.js`.
 
---

## Error Format

All error responses follow:

```json
{
  "error": "error message"
}
```

---

## Role Permission Matrix

| Endpoint | Parent | Mentor | Student |
|---|---|---|---|
| `POST /auth/signup` | ✅ | ✅ | ❌ |
| `POST /auth/login` | ✅ | ✅ | ✅ |
| `GET /me` | ✅ | ✅ | ✅ |
| `POST /students` | ✅ | ❌ | ❌ |
| `GET /students` | ✅ | ❌ | ❌ |
| `POST /lessons` | ❌ | ✅ | ❌ |
| `GET /lessons` | ✅ | ✅ | ❌ |
| `GET /lessons/mentor` | ❌ | ✅ | ❌ |
| `POST /lessons/:id/sessions` | ❌ | ✅ | ❌ |
| `GET /lessons/:id/sessions` | ✅ | ✅ | ✅ |
| `POST /bookings` | ✅ | ❌ | ❌ |
| `GET /bookings` | ✅ | ❌ | ✅ |
| `POST /llm/summarize` | ✅ | ✅ | ✅ |