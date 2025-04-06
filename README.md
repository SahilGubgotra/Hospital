# Hospital Management System

A modern Hospital Management Dashboard built with the MERN stack (MongoDB, Express, React, Node.js). This application provides an easy-to-use interface for managing hospital operations including patient appointments, doctor schedules, and medical records.

## Features

- **User Authentication**
  - Patient, Doctor, and Admin login
  - JWT-based authentication
  - Role-based access control

- **Patient Portal**
  - Book appointments with doctors
  - View appointment history
  - Pay for services
  - Request ambulance services

- **Doctor Portal**
  - Manage patient appointments
  - View patient history
  - Approve/reject appointment requests

- **Admin Dashboard**
  - User management
  - Doctor management
  - Hospital statistics

## Tech Stack

- **Frontend**: React, Material-UI, Redux, Formik
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Setting Up the Project

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/hospital-management-system.git
   cd hospital-management-system
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the backend directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   SECRET_KEY=your_jwt_secret_key
   PORT=8080
   ```

4. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

## Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   node index.js
   ```
   The server will start running at http://localhost:8080

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```
   The application will open in your browser at http://localhost:3000

## API Documentation

The API provides the following endpoints:

### Authentication
- `POST /signin` - User login
- `POST /signup` - User registration
- `POST /doctor/signin` - Doctor login

### Patient
- `GET /patient` - Get all appointments for the logged-in patient
- `POST /patient/appointment` - Book a new appointment
- `POST /patient/payment` - Make a payment
- `GET /userdetails` - Get logged-in user details

### Doctor
- `GET /doctor/appointments` - Get all appointments for the logged-in doctor
- `POST /doctor/approve/:id` - Approve a patient appointment
- `DELETE /doctor/reject/:id` - Reject a patient appointment

### Public
- `GET /public/doctor` - Get all doctors
- `GET /public/doctor/:id` - Get a specific doctor's details

## Troubleshooting

If you encounter any issues while setting up or running the application:

1. **Backend connection errors**
   - Ensure MongoDB is running
   - Check your .env file configuration
   - Verify network connectivity

2. **Frontend errors**
   - Clear browser cache
   - Update npm packages with `npm update`
   - Check console for specific error messages

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or suggestions, please open an issue on GitHub or contact the project maintainers.

---

Made with ❤️ by Your Team


# Need to  work on

1. Ability to accept the appointment by the doctor to acknowledge the patient that their appointment has been approved.


2. User should not be allowed to register if he/she tries to provide the already registered email ID.
The password should be encrypted and the password field shouldn't be displayed in the admin panel.

3. Enables users to generate invoices, track payments, and manage billing information for patients.

4. Addition of more fields in the prescription statement to make it more specific one.

5. Addition of more details on payment - such as date of the payment made, amount paid, etc.

6. Allows doctors and healthcare providers to create and manage their profiles, including specialties, availability, and contact information.


## Language and Technology used:

1. Html,css
2. Javascript
3. React
4. MongoDb
5. Express
6. Redux Toolkit 

## Installing

# Installing - easy ::
1.	Download the repository
```
git clone https://github.com/margiki/NHS-nodejs-webapp
```
2.	Open the Terminal (Linux & MacOS) or PowerShell (Windows) and change directory to the project folder.
3. Go to frontend folder and type " npm install " in the terminal and press Enter.All the dependencies of frontend would be installed.
```bash 
cd frontend 
npm install 
```
4. Go to backed  folder and type " npm install " in the terminal and press Enter.All the dependencies of backed  would be installed.
```bash 
cd backend  
npm install 
```

5.	Go back to the Terminal (PowerShell) and be sure that you are pointing inside the project folder. To open the application, type 'npm run dev ' and press Enter.
6.	The application should be live on the local port 3000.  
7.	Type http://localhost:3000/ into a browser.

8.	Now you should be inside the application



## Gettint Into The project


## Screenshots

## HomePage
Hospital Management System in mern stack. This system has a 'Home' page from where the patient & administrator can login into their accounts by toggling the tabs accordingly...

![homepage](<Screenshot (4).png>)



## Contact us page

'Contact' page allows users to provide feedback or queries about the services of the hospital. 
![contact page](<Screenshot (9).png>)


## Login
To make  a Appointment of Doctor user must be login first.

![login page](login.png)


##  Book his/her appointment:
After Login in successfully user book their  Appointment. The appointment form requires patients to select  Date and Time that they want to meet with the doctor and add their desease. The consultancy fee will be added by the administrator.

![Appoitnment](<Screenshot (7).png>)


## Add invoice from admin pannel

After the process of Appointment is completed.Administrator add the invoice for each Appointment.


![add invoice](<Screenshot (20)-1.png>)


## payment 

 Go to dashboard to see history of Appointment.  Now user can pay his bill through khalti payment gateway.

![user-dashboard](<Screenshot (17).png>)


![khalti-payment](<Screenshot (18).png>)





## Admin module

   This module is the heart of our project where an admin can see the list of all patients. Admin also can add the invoice for each user..who make a appointment of doctor. Admin can also Add docotor ,Delete Doctor.

   
![admin-user](<Screenshot (20).png>)


![admin-doctor](<Screenshot (19).png>)










