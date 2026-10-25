# Day 7 Assignment: SnapShare Scaling Plan

## 1. Assumptions

- SnapShare has 10,000,000 registered users.
- 10% of registered users are active each day.
- Each active user uploads 1 photo per day.
- Each active user views 50 feed pages per day.
- Each original photo is 2 MB.
- Each photo also has a 50 KB thumbnail.
- One day is approximately 100,000 seconds for these estimates.
- Peak traffic is estimated to be 5 times the average traffic.
- All uploaded photos and thumbnails are retained for one year.

### Daily active users

10,000,000 × 10% = **1,000,000 daily active users**

## 2. Traffic and Storage Estimates

### Uploads per second

Each daily active user uploads 1 photo.

1,000,000 uploads per day ÷ 100,000 seconds = **10 uploads per second on average**

Peak uploads per second:

10 × 5 = **50 uploads per second**

### Feed views per second

Each daily active user views 50 feed pages per day.

1,000,000 × 50 = 50,000,000 feed views per day

Average feed views per second:

50,000,000 ÷ 100,000 = **500 feed views per second**

Peak feed views per second:

500 × 5 = **2,500 feed views per second**

### Photo storage per year

Daily original photo storage:

1,000,000 × 2 MB = 2,000,000 MB = 2 TB per day

Daily thumbnail storage:

1,000,000 × 50 KB = 50,000,000 KB = approximately 50 GB per day

Total new storage per day:

2 TB + 50 GB = approximately 2.05 TB per day

Estimated storage for one year:

2.05 TB × 365 = **approximately 748 TB per year**

This estimate excludes backups, extra copies, metadata, and storage overhead.

## 3. Read-Heavy or Write-Heavy?

SnapShare is a **read-heavy system** because users view 50 feed pages per day but upload only 1 photo per day.

This means the system needs to handle many more feed requests than uploads. Caching, a CDN, and database read replicas can help serve feed content quickly and reduce the load on the primary database.

## 4. Why Photos Should Use Object Storage

Photo files should be stored in object storage rather than directly inside the database. Photos are large files, and object storage is designed to store and serve files efficiently at scale. The database should store information about each photo, such as its ID, owner, caption, upload time, and file location.

## 5. SnapShare Architecture Diagram

```text
                         Users / Mobile App
                                 |
                                DNS
                                 |
                  +--------------+--------------+
                  |                             |
             Static files                  Feed photos
                  |                             |
                 CDN <---------------------------+
                  |
          Browser files: HTML, CSS, JS

Users / Mobile App
        |
        | API requests
        v
  +----------------+
  | Load Balancer  |
  +----------------+
        |
        +-------------------+
        |                   |
        v                   v
  +-------------+     +-------------+
  | App Server 1|     | App Server 2|
  +-------------+     +-------------+
        |                   |
        +---------+---------+
                  |
        +---------+-------------------+
        |             |               |
        v             v               v
   +---------+  +------------+  +-------------+
   |  Cache  |  | Primary DB |  | Object      |
   | (Redis) |  +------------+  | Storage     |
   +---------+        |         | Photos and  |
                      v         | thumbnails  |
                +-------------+ +-------------+
                | Read Replica|
                +-------------+

  App Server
      |
      | Add thumbnail job
      v
  +-------------+       +------------------+
  | Message     | ----> | Thumbnail Worker |
  | Queue       |       +------------------+
  +-------------+                |
                                 v
                          Object Storage
```

## 6. What Each Component Does

- **DNS:** Translates the SnapShare domain name into an IP address.
- **CDN:** Delivers static files and cached photo content from servers close to users.
- **Load balancer:** Distributes API requests across healthy app servers.
- **App servers:** Handle user requests, validate uploads, manage feed requests, and communicate with other components.
- **Cache (Redis):** Stores frequently requested feed data or photo metadata to reduce database queries and latency.
- **Primary database:** Stores user accounts, photo metadata, captions, and other structured information; it handles writes.
- **Read replica:** Copies data from the primary database and handles suitable read queries to reduce the primary database's workload.
- **Object storage:** Stores the original photo files and generated thumbnails.
- **Message queue:** Holds thumbnail-generation jobs until a worker can process them.
- **Thumbnail worker:** Takes jobs from the queue, creates smaller versions of photos, and saves the thumbnails to object storage.

## 7. Photo Upload Flow

1. A user selects a photo and uploads it through the app.
2. The load balancer forwards the API request to a healthy app server.
3. The app server validates the upload, including its file type and size.
4. The original photo is stored in object storage.
5. The app server saves the photo's metadata and storage location in the primary database.
6. The app server adds a thumbnail-generation job to the message queue.
7. The app responds to the user that the upload was successful, without waiting for thumbnail generation to finish.
8. A thumbnail worker retrieves the job from the queue.
9. The worker creates a smaller thumbnail and stores it in object storage.
10. The feed can display the thumbnail to reduce download time and bandwidth. The CDN can cache frequently requested photo files.

## 8. Trade-Offs

### Speed vs. Freshness

Caching feed data and photo thumbnails makes the feed faster and reduces database load. However, cached content may briefly be outdated, so the system needs suitable cache expiration and invalidation rules.

### Cost vs. Reliability

Using multiple app servers and a read replica improves availability and helps distribute the workload. However, running extra servers and maintaining replicas costs more money.

### Fast Upload Response vs. Immediate Thumbnail Availability

Processing thumbnails in the background allows the app to confirm uploads quickly. However, the thumbnail may not be ready immediately, so the app may temporarily display a placeholder or the original photo.

### Consistency vs. Performance

Read replicas and caches can improve performance, but replication lag or stale cache entries may cause users to see slightly outdated feed information. The system must decide which information needs the freshest possible data.

## Conclusion

SnapShare can support a large user base by using a CDN for static content and cached photos, a load balancer with multiple app servers, Redis for frequently accessed data, a primary database with a read replica, object storage for photo files, and a message queue with a thumbnail worker. These components help the system handle high read traffic, process uploads efficiently, and scale as usage grows.