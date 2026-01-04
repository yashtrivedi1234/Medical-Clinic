# MediCare Clinic - Medical Clinic Website

A modern, fully responsive multi-page medical clinic website built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Designed for professional healthcare centers with a focus on trust, cleanliness, care, and reliability.

## 🎨 Features

- **Clean, Modern Design**: Medical-grade UI with soft blue, teal, and light green color palette
- **Fully Responsive**: Optimized for mobile, tablet, and desktop devices
- **Multi-Page Structure**: 
  - Home page with hero section, stats, services overview, and testimonials
  - About Us page with mission, vision, values, and certifications
  - Doctors page with detailed profiles and filtering
  - Services page with comprehensive service listings
  - Appointments page with online booking form
  - Contact page with contact form and map integration
  - Patient Portal for login, registration, and appointment management
  - Admin Panel for managing doctors, services, appointments, and testimonials

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Security**: Rate limiting, input validation, password hashing, CORS configuration, Helmet.js
- **Smooth Animations**: Framer Motion for enhanced user experience
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Production Ready**: Error handling, error boundaries, loading states, and optimized code

## 🏗️ Project Structure

```
Medical/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── constants.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── rateLimiter.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Doctor.js
│   │   │   ├── Service.js
│   │   │   ├── Appointment.js
│   │   │   └── Testimonial.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── doctors.js
│   │   │   ├── services.js
│   │   │   ├── appointments.js
│   │   │   ├── testimonials.js
│   │   │   └── admin.js
│   │   ├── scripts/
│   │   │   ├── seedData.js
│   │   │   └── createAdmin.js
│   │   ├── utils/
│   │   │   ├── errorHandler.js
│   │   │   └── asyncHandler.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Navbar.js
│   │   │   │   └── Footer.js
│   │   │   ├── ErrorBoundary.js
│   │   │   ├── Loading.js
│   │   │   └── ScrollToTop.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── About.js
│   │   │   ├── Doctors.js
│   │   │   ├── Services.js
│   │   │   ├── Appointments.js
│   │   │   ├── Contact.js
│   │   │   ├── PatientPortal.js
│   │   │   └── AdminPanel.js
│   │   ├── config/
│   │   │   └── constants.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   └── .env.example
├── package.json
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- React.js 18.2.0
- React Router DOM 6.20.1
- Tailwind CSS 3.3.6
- Framer Motion 10.16.16
- Axios 1.6.2
- React Icons 4.12.0
- React Toastify 9.1.3

### Backend
- Node.js
- Express.js 4.18.2
- MongoDB with Mongoose 8.0.3
- JWT (jsonwebtoken 9.0.2)
- Bcryptjs 2.4.3
- Express Validator 7.0.1
- Helmet 7.1.0
- Morgan 1.10.0
- Express Rate Limit 7.1.5

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Medical
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies (backend + frontend)
   npm run install-all
   
   # Or install separately
   npm run install-backend
   npm run install-frontend
   ```

3. **Configure environment variables**
   
   **Backend** - Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/medical-clinic
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:3000
   ```

   **Frontend** - Create a `.env` file in the `frontend` directory (optional):
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Seed initial data (optional)**
   ```bash
   npm run seed
   ```

6. **Create admin user (optional)**
   ```bash
   npm run create-admin
   ```
   Default admin credentials:
   - Email: admin@medicareclinic.com
   - Password: admin123
   **⚠️ Change this password immediately in production!**

7. **Run the application**
   
   **Option 1: Run both backend and frontend concurrently**
   ```bash
   npm run dev
   ```
   
   **Option 2: Run separately**
   ```bash
   # Terminal 1 - Start backend server
   npm run backend
   
   # Terminal 2 - Start frontend
   npm run frontend
   ```

8. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Health Check: http://localhost:5000/api/health

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get single doctor
- `POST /api/doctors` - Create doctor (Admin only)
- `PUT /api/doctors/:id` - Update doctor (Admin only)
- `DELETE /api/doctors/:id` - Delete doctor (Admin only)

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create service (Admin only)
- `PUT /api/services/:id` - Update service (Admin only)
- `DELETE /api/services/:id` - Delete service (Admin only)

### Appointments
- `GET /api/appointments` - Get appointments (filtered by user if patient)
- `GET /api/appointments/:id` - Get single appointment
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Testimonials
- `GET /api/testimonials` - Get approved testimonials
- `POST /api/testimonials` - Create testimonial
- `PUT /api/testimonials/:id/approve` - Approve testimonial (Admin only)
- `DELETE /api/testimonials/:id` - Delete testimonial (Admin only)

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics (Admin only)
- `GET /api/admin/appointments` - Get all appointments (Admin only)
- `PUT /api/admin/appointments/:id/status` - Update appointment status (Admin only)
- `GET /api/admin/testimonials` - Get all testimonials (Admin only)

## 🗄️ Database Schema

### Users
- name, email, phone, password, role (patient/admin), appointments[]

### Doctors
- name, specialization, qualification, experience, bio, image, department
- availability (weekly schedule), consultationFee, rating, isActive

### Services
- name, description, icon, department, price, duration, isActive

### Appointments
- patientName, phone, email, department, doctor, service
- appointmentDate, appointmentTime, status, notes, user

### Testimonials
- patientName, rating, comment, doctor, isApproved

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)
1. Set environment variables in your hosting platform
2. Update MongoDB URI to production database
3. Update FRONTEND_URL to your frontend domain
4. Deploy the backend folder

### Frontend Deployment (Vercel/Netlify)
1. Build the React app: `cd frontend && npm run build`
2. Deploy the `build` folder
3. Set `REACT_APP_API_URL` to your backend URL

## 🔒 Security Features

- JWT authentication with secure token storage
- Password hashing with bcrypt (12 rounds)
- Rate limiting on API routes (100 requests per 15 minutes)
- Auth rate limiting (5 login attempts per 15 minutes)
- Input validation with express-validator
- Helmet.js for security headers
- CORS configuration
- Role-based access control
- Error handling and logging
- Production error messages (no stack traces)

## 📝 Production Checklist

- [ ] Change all default credentials
- [ ] Update clinic information (addresses, phone numbers)
- [ ] Configure production database
- [ ] Set strong JWT_SECRET (minimum 32 characters)
- [ ] Update FRONTEND_URL for CORS
- [ ] Integrate Google Maps API for contact page
- [ ] Add email/SMS notification service for appointments
- [ ] Set up proper error logging (Winston, Sentry, etc.)
- [ ] Configure HTTPS for production deployment
- [ ] Add image upload functionality for doctor profiles
- [ ] Implement file upload for prescriptions in patient portal
- [ ] Set up CI/CD pipeline
- [ ] Add monitoring and analytics
- [ ] Test thoroughly before deployment

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Built with ❤️ for healthcare professionals

---

**Note**: This is a production-ready template. Make sure to complete the production checklist before deploying to production.
