# ICAI Doctor API Documentation

This document provides detailed information about the API endpoints available in the ICAI Doctor application.

## Base URL

`http://localhost:PORT/api` (Default PORT is 3000)

## Authentication

Most endpoints require a JSON Web Token (JWT) to be sent in the `Authorization` header.
Format: `Authorization: Bearer <your_token>`

## Common Response Format

All API responses follow a standard JSON structure:

```json
{
  "success": true,
  "msg": "Action description",
  "data": { ... } // Or null
}
```

---

## Auth API (`/api/auth`)

### Register User

- **Method:** `POST`
- **Path:** `/register`
- **Body:**
  - `name` (string, required, min 2)
  - `email` (string, required, email)
  - `password` (string, required, min 6)
- **Auth Required:** No

### Login User

- **Method:** `POST`
- **Path:** `/login`
- **Body:**
  - `email` (string, required, email)
  - `password` (string, required)
- **Auth Required:** No
- **Response Data:**
  - `token` (string)
  - `user` (object: `id`, `name`, `email`)

### Get Profile

- **Method:** `GET`
- **Path:** `/profile`
- **Auth Required:** Yes
- **Response Data:**
  - `user` (object: `id`, `name`, `email`, `createdAt`)

### Update Name

- **Method:** `POST`
- **Path:** `/update-name`
- **Body:**
  - `name` (string, required, min 2)
- **Auth Required:** Yes

### Update Password

- **Method:** `POST`
- **Path:** `/update-password`
- **Body:**
  - `currentPassword` (string, required)
  - `newPassword` (string, required, min 6)
- **Auth Required:** Yes

---

## Bank Details API (`/api/bank`)

### List Bank Details

- **Method:** `GET`
- **Path:** `/`
- **Auth Required:** Yes
- **Description:** Returns all bank details created by the authenticated user.

### Get Bank Detail by ID

- **Method:** `GET`
- **Path:** `/:id`
- **Auth Required:** Yes

### Create Bank Detail

- **Method:** `POST`
- **Path:** `/`
- **Body:**
  - `mrn` (string, required)
  - `counsellorName` (string, required)
  - `bankAccountNo` (string, required, min 5)
  - `bankName` (string, required)
  - `branchName` (string, required)
  - `payeeName` (string, required)
  - `ifscCode` (string, required)
- **Auth Required:** Yes

### Update Bank Detail

- **Method:** `POST`
- **Path:** `/:id`
- **Body:** Same as Create
- **Auth Required:** Yes

### Delete Bank Detail

- **Method:** `DELETE`
- **Path:** `/:id`
- **Auth Required:** Yes

---

## Events API (`/api/event`)

### List Events

- **Method:** `GET`
- **Path:** `/`
- **Auth Required:** Yes
- **Description:** Returns all events created by the authenticated user.

### List Events by Year

- **Method:** `GET`
- **Path:** `/year/:year`
- **Auth Required:** Yes
- **Params:** `year` (string, 4 digits)

### Get Event by ID

- **Method:** `GET`
- **Path:** `/:id`
- **Auth Required:** Yes

### Create Event

- **Method:** `POST`
- **Path:** `/`
- **Body:**
  - `eventType` (Enum: [EventType](#eventtype), required)
  - `eventName` (string, required)
  - `branch` (string, required)
  - `membershipNoCounsellor` (string, required)
  - `counsellorName` (string, required)
  - `eventDate` (string, required, YYYY-MM-DD)
  - `startTime` (string, required, HH:mm)
  - `endTime` (string, required, HH:mm)
  - `schoolCollegeName` (string, required)
  - `address` (string, required)
  - `streetAddress` (string, required)
  - `locality` (string, required)
  - `city` (string, required)
  - `state` (string, required)
  - `country` (string, required)
  - `pinCode` (string, required)
  - `expectedParticipants` (number, required)
  - `contactPersonName` (string, required)
  - `email` (string, required, email)
  - `phone` (string, required, min 10)
  - `modeOfEvent` (string, required)
  - `principalCoordinatorName` (string, required)
  - `principalCoordinatorMobile` (string, required, min 10)
  - `principalCoordinatorEmail` (string, required, email)
  - `additionalComments` (string, optional)
- **Auth Required:** Yes

### Update Event

- **Method:** `POST`
- **Path:** `/:id`
- **Body:** Same as Create
- **Auth Required:** Yes

### Delete Event

- **Method:** `DELETE`
- **Path:** `/:id`
- **Auth Required:** Yes

---

## Video API (`/api/video`)

### List All Videos

- **Method:** `GET`
- **Path:** `/`
- **Auth Required:** Yes
- **Description:** Returns all videos associated with events created by the authenticated user.

### Get Video by ID

- **Method:** `GET`
- **Path:** `/:id`
- **Auth Required:** Yes

### Get Videos for Event

- **Method:** `GET`
- **Path:** `/event/:eventId`
- **Auth Required:** Yes

### Create Videos

- **Method:** `POST`
- **Path:** `/`
- **Body:**
  - `eventId` (string, required)
  - `filenames` (array of strings, required, min 1)
- **Auth Required:** Yes

### Update Video

- **Method:** `POST`
- **Path:** `/:id`
- **Body:**
  - `videoPath` (string, required)
- **Auth Required:** Yes

### Delete Video

- **Method:** `DELETE`
- **Path:** `/:id`
- **Auth Required:** Yes

---

## Attachment API (`/api/attachment`)

### List All Attachments

- **Method:** `GET`
- **Path:** `/`
- **Auth Required:** Yes
- **Description:** Returns all attachments associated with events created by the authenticated user.

### Get Attachment by ID

- **Method:** `GET`
- **Path:** `/:id`
- **Auth Required:** Yes

### Get Attachments for Event

- **Method:** `GET`
- **Path:** `/event/:eventId`
- **Auth Required:** Yes

### Create Attachment

- **Method:** `POST`
- **Path:** `/`
- **Body:**
  - `eventId` (string, required)
  - `attendanceSheetPath` (string, required)
  - `annexurePath` (string, required)
  - `eventImagePath` (string, required)
- **Auth Required:** Yes

### Update Attachment

- **Method:** `POST`
- **Path:** `/:id`
- **Body:** Same as Create
- **Auth Required:** Yes

### Delete Attachment

- **Method:** `DELETE`
- **Path:** `/:id`
- **Auth Required:** Yes

---

## Upload API (`/api/upload`)

### Upload File

- **Method:** `POST`
- **Path:** `/`
- **Body:** `multipart/form-data`
  - `file`: The file to upload (required, max 100MB)
- **Response Data:**
  - `filename` (string)
- **Auth Required:** Yes

---

## Static Files

Uploaded files are served at `/uploads/:filename`.

---

## Enums

### EventType

The following values are valid for the `eventType` field:

- `CAREER COUNSELLING PROGRAMME`
- `MEGA CAREER COUNSELLING PROGRAMME`
- `MAJOR MEGA EVENT`
- `SUPER MEGA CAREER COUNSELLING`
- `CAREER / EDUCATION FAIR`
