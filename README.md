# BNPL-Payment-Plan-Simulator

## Introduction

A simplified **Buy Now, Pay Later (BNPL)** dashboard that allows **merchants** to create payment plans and **users** to view and manage their installments.


This module allows you to:
- Create Users (User or Merchant)
- Monitor Plan progress
- Pay Installments

## Features

### 🖥️ Backend (Django + DRF)

- **Models**:
  - `User` (with roles: merchant, user)
  - `PaymentPlan`
  - `Installment`

- **API Endpoints**:
    - `POST /api/token/`: Login as user or merchant.
  - `GET /api/signup/`: SignUp as user or merchant.
  - `POST /api/role/`: Fetch User role.
  - `POST /api/plans/`: Merchants create BNPL plans.
  - `GET /api/plans/`: Merchants see created plans; users see their own.
  - `POST /api/installments/{id}/pay/`: Simulate installment payment.

- **Validation**:
  - Total installments must sum to the `total_amount`.
  - Paid installments cannot be edited.
  - Plan cannot be created with merchant email.
  - Plan cannot be created with invalid email.

- **Extras**:
  - Auto-calculation of installment amounts and due dates.
  - Sending emails to users before due date of each installment 
  - Django signals update `PaymentPlan.status` when all installments are paid.

---

### 🌐 Frontend (React.js)

- **Merchant View**:
  - Create BNPL plans.
  - Auto-generate installments based on inputs (amount, user email, tenor and start date).
  - Mentor plans progress
    - Summary Cards will be available in here that define the total revenue, total plans and the `success rate` 
        - `success rate will be calculated according to the settled plans only`

- **User View**:
  - Dashboard showing upcoming and past installments (color-coded).
  - "Pay Now" button to simulate installment payment.
  - Progress bar per plan (e.g., `2/4 installments paid`).

- **Authentication**:
  - Separate login flows for merchants and users.

---

## 🔐 Security

- API permissions ensure users cannot access other users' data.
- JWT token used for authentiaction.

---


## Setup Environment and Using Docker Compose

To set up the environment and run the application using Docker Compose, follow these steps:

### Prerequisites
Ensure that you have [Docker](https://www.docker.com/products/docker-desktop) and [Docker Compose](https://docs.docker.com/compose/) installed on your machine.

### Steps to Set Up

1. **Clone the Repository**  
   Clone this repository to your local machine:
   ```bash
   git clone https://github.com/ahmedyasser202498/BNPL-Payment-Plan-Simulator.git
   cd BNPL-Payment-Plan-Simulator
	```
2. **Build the Docker Containers**  
   To build the Docker images defined in the docker-compose.yml file, run:
   ```bash
   docker-compose build
   ```

3. **Start the Application with Docker Compose**  
   After building the images, start the services (database, backend and frontend) with:
   ```bash
   docker-compose up
   ```
   
   This will:
	- Set up a PostgreSQL database service (db).
	- Set up a backend service (backend).
    - Set up a frontend service (frontend).
4. **Access the Web Application**  
   Once the services are up, you can access the web application at http://localhost:8000

   After this:
	- Sign Up with at least one user and one merchant to use the dashboards
	- Login with merchant to create plans
    - Sign out
    - Login with user to view plans and pay installments

5. **Stopping the Services**  
   To stop the services, use:
   ```bash
   docker-compose down
# 📦 Models Overview

The application includes several Django models that represent the core components of the **Buy Now, Pay Later (BNPL)** system. These models define the structure of data and enforce business logic such as installment tracking, plan status updates, and user roles.

---

## 👤 User Model

The `User` model extends Django’s built-in `AbstractUser` to support merchant and consumer roles.

### Fields:
- `is_merchant`: A boolean indicating whether the user is a merchant.
- `email`: The unique email used for authentication (replaces the default username).
- `USERNAME_FIELD`: Set to `email` for email-based login.
- `REQUIRED_FIELDS`: Includes `username`, since it’s required by `AbstractUser`.

### Properties and Methods:
- `full_name`: A computed property that returns the user's full name.
- `save()`: Overrides the save method to enforce model validation using `full_clean()`.

---

## 🧾 PaymentPlan Model

The `PaymentPlan` model represents a BNPL payment plan created by a merchant for a user, splitting a total amount into multiple scheduled installments.

### Fields:
- `merchant`: Foreign key to the user who created the plan.
- `user`: Foreign key to the customer who will repay the plan.
- `total_amount`: The full amount to be repaid.
- `number_of_installments`: Total number of installments.
- `start_date`: Date from which installments begin.
- `status`: The current plan status (e.g., Active, Completed), defined by `PlantStatus` enum.

### Inherited Fields (from `TimeStampMixin`):
- `created_at`: Timestamp of creation.
- `updated_at`: Timestamp of last update.

### Properties:
- `paid_installments`: Returns the count of paid installments (regardless of whether they were paid on time or not).
- `paid_installments_amount`: Returns the total amount paid across all paid installments.


## 💳 Installment Model

The `Installment` model represents an individual scheduled payment within a payment plan.
W
### Fields:
- `period`: Sequential number of the installment (e.g., 1 for first month).
- `plan`: Foreign key linking the installment to a `PaymentPlan`.
- `amount`: Amount due in this installment.
- `due_date`: Date when the installment is due.
- `status`: Current status of the installment (e.g., Not Due Yet, Paid On Time), defined by `PaymentStatus` enum.

### Inherited Fields (from `TimeStampMixin`):
- `created_at`: Timestamp of creation.
- `updated_at`: Timestamp of last update.

---

# 🔗 Relationships Between Models

- **User ↔ PaymentPlan**: A `User` can be both a **merchant** and a **customer**.  
  - Merchants have many `merchant_plans`.
  - Users have many `user_plans`.

- **PaymentPlan ↔ Installment**: A `PaymentPlan` can have multiple associated `Installments`.

- **Installment Status**: Tracks the state of each installment — including:
  - **On-time payments**
  - **Late payments**
  - **Pending dues**

---

These models enable a complete lifecycle for **BNPL plans**, from creation and validation to payment tracking and status updates.  
They are designed to enforce **business rules** while maintaining a clean separation of responsibilities between **merchants** and **users**.

---



# 🧩 Bonus Overview


To automate the process of sending payment reminders, we've included a **custom Django migration** that creates a periodic Celery Beat task during deployment. This ensures that the task responsible for emailing users about upcoming payments is scheduled automatically—without requiring any manual configuration in the Django admin.

### 📋 What This Does

A migration file (`0003_create_celery_beat_task.py`) in the `crm_app` app:

- Retrieves or creates a daily interval schedule using Celery Beat's `IntervalSchedule` model.
- Registers a periodic task named **"Send Reminders"** using the `PeriodicTask` model.
- Links that periodic task to the Celery task `apps.payments.tasks.send_payment_reminders`.

This task is configured to run **once per day**.

### 🔁 How It Works

The migration code looks like this:

```python
def create_reminder_task(apps, schema_editor):
    IntervalSchedule = apps.get_model('django_celery_beat', 'IntervalSchedule')
    PeriodicTask = apps.get_model('django_celery_beat', 'PeriodicTask')

    schedule, _ = IntervalSchedule.objects.get_or_create(every=1, period='days')

    PeriodicTask.objects.get_or_create(
        interval=schedule,
        name='Send Reminders',
        task='apps.payments.tasks.send_payment_reminders',
    )
```
This is executed via a standard Django migration operation:

### 📫 What Task Gets Called?
The periodic task runs the Celery task defined in:
`crm_app/tasks.py`

```python
from celery import shared_task
from django.core.mail import send_mail
from django.utils.timezone import now
from datetime import timedelta

from crm_app.models import Installment

@shared_task
def send_payment_reminders():
    due_date = now().date() + timedelta(days=3)
    intallments = Installment.objects.filter(due_date=due_date)

    for installment in intallments:
        send_mail(
            subject="Installment Reminder",
            message=f"Hi {installment.plan.user.email}, your installment of {installment.amount} is due in 3 days.",
            from_email=None,
            recipient_list=[installment.plan.user.email],
        )

```
This will automatically send reminder emails to users who have payments due in 3 days.


---



# 🧪 Trade-Offs Overview
To facilitate seamless and flexible testing of the dashboard functionality, no strict date validations were implemented during the creation of plans. This intentional design decision allows developers and testers to simulate various payment scenarios—such as early, on-time, or late payments—without constraints.