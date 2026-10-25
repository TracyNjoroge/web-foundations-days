
# School Database Design

## 1. Tables

### Students
The students table stores information about each student. It contains an id as the primary key, a name, and an email address. The email is UNIQUE so that two students cannot use the same email address.

### Courses
The courses table stores information about available courses. Each course has a unique id as its primary key and a name. The course name is required.

### Enrolments
The enrolments table records which students are enrolled in which courses. It contains its own primary key, student_id, course_id, and grade. The student_id and course_id columns are foreign keys that reference the students and courses tables. The UNIQUE constraint on student_id and course_id prevents the same student from enrolling in the same course more than once.

## 2. Relationships

There is a one-to-many relationship between students and enrolments because one student can enrol in several courses, while each enrolment belongs to one student.

There is also a one-to-many relationship between courses and enrolments because one course can have many enrolled students, while each enrolment refers to one course.

Students and courses have a many-to-many relationship because one student can take several courses and one course can have several students. The enrolments table acts as a join table between them. It also stores the grade for each student's enrolment.

## 3. Index

I would add an index on enrolments(course_id). This can make searches for students enrolled in a particular course faster, especially when the database contains many enrolments. An index uses additional storage, so indexes should be added where they are useful.

## 4. SQL or NoSQL?

I would choose a relational SQL database for this school system. Students, courses, and enrolments have clear relationships, and the system needs to maintain data integrity. SQL supports primary keys, foreign keys, UNIQUE constraints, and JOIN queries, which help prevent invalid enrolments and retrieve related information. SQLite is suitable for this small project, while a larger school system could use PostgreSQL or MySQL.
