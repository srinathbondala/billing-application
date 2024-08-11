# Bills Management API

This project is an Express.js-based RESTful API for managing bills. The API supports CRUD operations for bills and includes a feature to download bill data as an Excel file.

## Run Command
### node app.js

## Features

### 1. Create a Bill
- **Endpoint:** `POST /bills`
- **Description:** Adds a new bill to the database.

### 2. Retrieve All Bills
- **Endpoint:** `GET /bills`
- **Description:** Retrieves all bills from the database.

### 3. Retrieve a Specific Bill
- **Endpoint:** `GET /bills/:id`
- **Description:** Retrieves a specific bill by its ID.

### 4. Update a Bill
- **Endpoint:** `PUT /bills/:id`
- **Description:** Updates a specific bill's details.

### 5. Delete a Bill
- **Endpoint:** `DELETE /bills/:id`
- **Description:** Deletes a specific bill from the database.

### 6. Download Bills Data
- **Endpoint:** `GET /download`
- **Description:** Downloads all bills data as an Excel file.

## Front End Additional Features

### 1. Login & Logout
- **Description:** Login and logout feature for user need to be connected to MYSQL.

### 2. View Data as table and card
- **Description:** Display Data as Card and Table.

### 3. Search By Id
- **Description:** get Data by Id.

### 4. CRUD operation
- **Description:** implemented create,read,update,delete operations.

## Bill Table Schema

This document provides the SQL schema for creating the `bill` table with the `payment_method` column using the ENUM type. This schema defines the structure and constraints of the `bill` table in your database.

### Table Definition

To create the `bill` table, use the following SQL `CREATE TABLE` statement:

```sql
CREATE TABLE bill (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bill_number VARCHAR(20) NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    bill_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('Paid', 'Unpaid') NOT NULL,
    payment_due_date DATE NOT NULL,
    payment_method ENUM('Debit card', 'Credit card', 'Cash', 'UPI', 'Net banking', 'Bank Transfer') NOT NULL
);


