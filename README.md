# TaskBoard Pro - Advanced Task Collaboration App with Workflow Automation

TaskBoard Pro is a comprehensive project collaboration platform where users can create projects, add tasks, move tasks across statuses, assign tasks to teammates, and set automation rules (mini workflows).

## Features

### User Authentication
- Google OAuth (Firebase) login
- Store basic user profile: Name, Email

### Project Management
- Create projects with title and description
- Invite other users to projects by email
- Project access control (only members can access)

### Task Management
- Create tasks with title, description, due date, and assignee
- Move tasks across statuses using a Kanban board interface
- Default statuses: 'To Do', 'In Progress', 'Done'

### Workflow Automation
- Project owners can create automations like:
  - When a task is moved to 'Done' -> assign badge
  - When a task is assigned to user X -> move to 'In Progress'
  - When a due date passes -> send notification
- Automations are stored in the database and triggered server-side

### Additional Features
- Real-time updates (planned)
- Commenting system on tasks (planned)
- User badges based on completed tasks

## API Documentation

### Authentication
- `POST /api/auth/login` - Login with Google credentials
- `POST /api/auth/verify` - Verify user token

### Projects
- `GET /api/projects` - Get all projects for the authenticated user
- `GET /api/projects/:id` - Get a specific project by ID
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `POST /api/projects/:id/invite` - Invite a user to a project

### Tasks
- `GET /api/projects/:id/tasks` - Get all tasks for a project
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `PUT /api/tasks/:id/status` - Update a task's status
- `PUT /api/tasks/:id/assign` - Assign a task to a user

### Automations
- `GET /api/projects/:id/automations` - Get all automations for a project
- `POST /api/automations` - Create a new automation
- `PUT /api/automations/:id` - Update an automation
- `DELETE /api/automations/:id` - Delete an automation

## Database Schema

### Users
```
{
  id: string,          // Firebase UID
  name: string,
  email: string,
  photoURL: string     // Optional
}
```

### Projects
```
{
  id: string,
  title: string,
  description: string,
  ownerId: string,     // Reference to Users
  members: string[],   // Array of User IDs
  statuses: string[],  // Array of status names
  createdAt: Date,
  updatedAt: Date
}
```

### Tasks
```
{
  id: string,
  projectId: string,   // Reference to Projects
  title: string,
  description: string,
  status: string,
  dueDate: Date,       // Optional
  assigneeId: string,  // Optional, reference to Users
  createdBy: string,   // Reference to Users
  createdAt: Date,
  updatedAt: Date
}
```

### Comments
```
{
  id: string,
  taskId: string,      // Reference to Tasks
  userId: string,      // Reference to Users
  content: string,
  createdAt: Date
}
```

### Automations
```
{
  id: string,
  projectId: string,   // Reference to Projects
  name: string,
  trigger: {
    type: string,      // 'status_change', 'assignment', 'due_date'
    condition: object  // Depends on trigger type
  },
  action: {
    type: string,      // 'change_status', 'assign_badge', 'send_notification'
    data: object       // Depends on action type
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Notifications
```
{
  id: string,
  userId: string,      // Reference to Users
  title: string,
  message: string,
  read: boolean,
  createdAt: Date
}
```

### Badges
```
{
  id: string,
  name: string,
  description: string,
  icon: string
}
```

### UserBadges
```
{
  userId: string,      // Reference to Users
  badgeId: string,     // Reference to Badges
  earnedAt: Date
}
```

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file based on `.env.example` and add your Firebase configuration
4. Start the development server with `npm run dev`

## Technologies Used

### Frontend
- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Zustand for state management
- React Beautiful DND for drag-and-drop functionality
- Firebase Authentication
- Axios for API requests
- Lucide React for icons

### Backend (Separate Repository)
- Node.js with Express
- MongoDB with Mongoose
- Firebase Admin SDK for authentication verification
- WebSockets for real-time updates (planned)

## License

MIT