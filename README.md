# Admin Portal - FullStack Engineering Consultancy

A comprehensive admin portal built with React, TypeScript, Vite, TailwindCSS, and Firebase for managing the FullStack Engineering Consultancy Services website.

## 🚀 Features

### Authentication & Authorization
- Firebase Authentication integration
- Role-based access control (Super Admin, Admin, Editor)
- Session management with auto-logout
- Password reset functionality
- Secure admin registration

### Project Management
- Advanced CRUD operations for projects
- Rich text editor with WYSIWYG capabilities
- Bulk operations (delete, status update)
- Project templates for quick creation
- File upload for project images/documents
- Project versioning (draft, published, archived)
- Advanced filtering and search
- Real-time project analytics

### Content Management
- Services management
- About page content editor
- Home page hero section management
- Testimonials management
- Blog/News management
- SEO meta tags management

### User Management
- Admin user CRUD operations
- Role assignment and permissions
- Activity logs tracking
- User permissions matrix

### Analytics Dashboard
- Project statistics and metrics
- User engagement tracking
- Popular projects analytics
- Content performance metrics
- Export reports (PDF, Excel)

### Advanced Features
- File management with compression
- Workflow management
- Notification system
- Security features (IP whitelisting, 2FA)
- Real-time updates
- Dark/Light theme support
- Responsive design
- Accessibility compliance (WCAG 2.1)

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + Framer Motion
- **Backend**: Firebase (Auth + Firestore + Storage)
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Charts**: Recharts
- **Rich Text**: React Quill

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd admin-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Fill in your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Set up Firebase**
   - Create a new Firebase project
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Enable Storage
   - Deploy Firestore security rules from `firestore.rules`

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication, Firestore, and Storage

2. **Configure Authentication**
   - Go to Authentication > Sign-in method
   - Enable Email/Password provider
   - Add your admin email to authorized users

3. **Set up Firestore**
   - Go to Firestore Database
   - Create database in production mode
   - Deploy the security rules from `firestore.rules`

4. **Configure Storage**
   - Go to Storage
   - Create storage bucket
   - Set up security rules for file uploads

### Initial Admin User Setup

1. **Create Admin User in Firebase Console**
   - Go to Authentication > Users
   - Add a new user with your admin email
   - Set a secure password

2. **Add Admin User to Firestore**
   ```javascript
   // Add this to your Firestore adminUsers collection
   {
     id: "your-user-id",
     email: "admin@example.com",
     role: "super_admin",
     permissions: ["all"],
     createdAt: new Date(),
     lastLogin: new Date(),
     isActive: true,
     name: "Admin User"
   }
   ```

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminNavbar.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── ProjectForm.tsx
│   │   ├── ProjectTable.tsx
│   │   └── UserManagement.tsx
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── ProjectManagement.tsx
│   │   ├── UserManagement.tsx
│   │   ├── ContentManagement.tsx
│   │   └── Analytics.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useProjects.ts
│   └── useFirebase.ts
├── services/
│   ├── authService.ts
│   ├── projectService.ts
│   └── userService.ts
├── types/
│   ├── admin.ts
│   └── project.ts
└── firebase/
    └── config.ts
```

## 🔐 Security Features

- **Firebase Security Rules**: Comprehensive rules for data protection
- **Input Validation**: Client and server-side validation
- **CSRF Protection**: Built-in protection mechanisms
- **Rate Limiting**: API call rate limiting
- **Audit Logging**: Complete activity tracking
- **Role-based Access**: Granular permission system

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Environment Setup
- Set up production environment variables
- Configure Firebase project for production
- Set up custom domain (optional)
- Enable SSL certificates

## 📊 Analytics Integration

The admin portal includes built-in analytics features:

- **Project Performance**: Track views, engagement, and conversions
- **User Analytics**: Monitor admin user activity
- **Content Analytics**: Analyze content performance
- **Export Capabilities**: Generate reports in PDF/Excel format

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /auth/login` - Admin login
- `POST /auth/logout` - Admin logout
- `POST /auth/reset-password` - Password reset

### Project Management
- `GET /projects` - List projects with filtering
- `POST /projects` - Create new project
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project
- `POST /projects/bulk` - Bulk operations

### User Management
- `GET /admin/users` - List admin users
- `POST /admin/users` - Create admin user
- `PUT /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Delete user

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Updates

### Version 1.0.0
- Initial release with core features
- Authentication and authorization
- Project management
- Content management
- Analytics dashboard
- User management

### Planned Features
- Advanced workflow management
- Two-factor authentication
- Advanced analytics
- Mobile app integration
- API rate limiting
- Advanced security features

---

**Built with ❤️ for FullStack Engineering Consultancy Services**
