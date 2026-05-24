# Database ER Diagram

## Collections

### User
- _id (ObjectId)
- name (String)
- email (String, unique)
- password (String)
- role (String)
- createdAt (Date)

### Meeting
- _id (ObjectId)
- meetingId (String, unique)
- title (String)
- description (String)
- host (ObjectId → User)
- participants (Array → User)
- status (String)
- startTime (Date)
- endTime (Date)

## Relationships
- User → Meeting (one-to-many, as host)
- User → Meeting (many-to-many, as participant)