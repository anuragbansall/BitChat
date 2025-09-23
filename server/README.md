# BitChat Server API Documentation

This document describes the REST API endpoints for the BitChat backend server. Use these endpoints to interact with authentication, user, and messaging features from the frontend.

---

## Authentication Endpoints

### Register

- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response:**
  - `201 Created` on success
  - JSON with user info and token

### Login

- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response:**
  - `200 OK` on success
  - JSON with user info and token

### Logout

- **URL:** `/api/auth/logout`
- **Method:** `POST`
- **Response:**
  - `200 OK` on success
  - JSON message

### Get Profile

- **URL:** `/api/auth/profile`
- **Method:** `GET`
- **Headers:**
  - Requires authentication (token cookie)
- **Response:**
  - `200 OK` on success
  - JSON with user info

---

## User Endpoints

### Get All Users

- **URL:** `/api/users/`
- **Method:** `GET`
- **Headers:**
  - Requires authentication (token cookie)
- **Response:**
  - `200 OK` on success
  - JSON array of users (excluding current user)

---

## Message Endpoints

### Get Messages By User

- **URL:** `/api/messages/:userId`
- **Method:** `GET`
- **Headers:**
  - Requires authentication (token cookie)
- **Response:**
  - `200 OK` on success
  - JSON array of messages between current user and `userId`

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "status": "error",
  "message": "Error message here"
}
```

---

## Notes

- All endpoints expect and return JSON.
- Authentication is handled via HTTP-only cookies containing a JWT token.
- You must be logged in to access user and message endpoints.

---

## For further details, see controller files or ask the backend developer.

## Socket.io Chat API

BitChat uses Socket.io for real-time chat. Connect to the server using Socket.io on the frontend to send and receive messages instantly.

### Socket.io Connection

- **URL:** `ws://<server-host>:<port>`
- **Library:** Use `socket.io-client` in frontend

### Events

#### Connect

Client connects to the server:

```js
const socket = io("http://localhost:5000");
```

#### Authenticate (if required)

Send JWT token after connecting (if backend expects it):

```js
socket.emit("authenticate", { token });
```

#### Send Message

- **Event:** `send_message`
- **Payload:**
  ```json
  {
    "receiverId": "string",
    "content": "string"
  }
  ```
  Example:

```js
socket.emit("send_message", { receiverId, content });
```

#### Receive Message

- **Event:** `receive_message`
- **Payload:**
  ```json
  {
    "senderId": "string",
    "content": "string",
    "timestamp": "ISO8601 string"
  }
  ```
  Example:

```js
socket.on("receive_message", (msg) => {
  // handle incoming message
});
```

#### User Online/Offline (optional)

- **Event:** `user_online`, `user_offline`
- **Payload:**
  ```json
  {
    "userId": "string"
  }
  ```

---

## Socket.io Error Handling

Errors may be sent as events, e.g.:

```js
socket.on("error", (err) => {
  // handle error
});
```

---

For further details, see controller files, socket server implementation, or ask the backend developer.
