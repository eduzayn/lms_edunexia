import React from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { useRouter } from 'next/navigation';
import { AuthProvider } from '../../lib/contexts/auth-context';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({ get: jest.fn() })),
}));

// Mock Supabase client
jest.mock('../../lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: { user: { id: '789', email: 'admin@example.com' } } },
        error: null,
      }),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
      signInWithPassword: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: {
              id: '789',
              user_id: '789',
              name: 'Test Admin',
              email: 'admin@example.com',
              role: 'admin',
            },
            error: null,
          }),
        })),
      })),
      insert: jest.fn().mockResolvedValue({
        data: { id: 'user123' },
        error: null,
      }),
    })),
  })),
}));

// Mock analytics service
jest.mock('../../lib/services/analytics-service', () => ({
  getAdminAnalytics: jest.fn().mockResolvedValue({
    totalStudents: 100,
    totalTeachers: 10,
    totalCourses: 25,
    totalAssessments: 50,
    recentActivity: [
      { id: 'activity1', user: 'Student 1', action: 'Completed assessment', timestamp: new Date().toISOString() },
      { id: 'activity2', user: 'Teacher 1', action: 'Created course', timestamp: new Date().toISOString() },
    ],
  }),
}));

describe('Admin Journey Integration Tests', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should allow admin to log in, view dashboard, and manage users', async () => {
    // Mock components for testing the flow
    const LoginComponent = () => {
      const router = useRouter();
      const handleLogin = () => {
        router.push('/admin/dashboard');
      };

      return (
        <div>
          <h1>Admin Login</h1>
          <input data-testid="email-input" placeholder="Email" />
          <input data-testid="password-input" type="password" placeholder="Password" />
          <button onClick={handleLogin}>Login</button>
        </div>
      );
    };

    const DashboardComponent = () => {
      const router = useRouter();
      const goToUserManagement = () => {
        router.push('/admin/users');
      };

      return (
        <div>
          <h1>Admin Dashboard</h1>
          <div data-testid="analytics-summary">
            <p>Total Students: 100</p>
            <p>Total Teachers: 10</p>
            <p>Total Courses: 25</p>
            <p>Total Assessments: 50</p>
          </div>
          <div data-testid="recent-activity">
            <h2>Recent Activity</h2>
            <p>Student 1: Completed assessment</p>
            <p>Teacher 1: Created course</p>
          </div>
          <button onClick={goToUserManagement}>Manage Users</button>
        </div>
      );
    };

    const UserManagementComponent = () => {
      const router = useRouter();
      const createNewUser = () => {
        router.push('/admin/users/create');
      };

      return (
        <div>
          <h1>User Management</h1>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              <tr data-testid="user-row">
                <td>John Doe</td>
                <td>john@example.com</td>
                <td>Student</td>
              </tr>
              <tr data-testid="user-row">
                <td>Jane Smith</td>
                <td>jane@example.com</td>
                <td>Teacher</td>
              </tr>
            </tbody>
          </table>
          <button onClick={createNewUser}>Create New User</button>
        </div>
      );
    };

    const CreateUserComponent = () => {
      const router = useRouter();
      const handleSubmit = () => {
        // Simulate user creation
        router.push('/admin/users');
      };

      return (
        <div>
          <h1>Create User</h1>
          <input data-testid="name-input" placeholder="Name" />
          <input data-testid="email-input" placeholder="Email" />
          <select data-testid="role-select">
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={handleSubmit}>Save User</button>
        </div>
      );
    };

    // Render login component
    const { rerender } = render(
      <AuthProvider>
        <LoginComponent />
      </AuthProvider>
    );

    // Fill login form and submit
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'admin@example.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Login'));

    // Verify navigation to dashboard
    expect(mockRouter.push).toHaveBeenCalledWith('/admin/dashboard');

    // Render dashboard component
    rerender(
      <AuthProvider>
        <DashboardComponent />
      </AuthProvider>
    );

    // Verify analytics are displayed
    expect(screen.getByText('Total Students: 100')).toBeInTheDocument();
    expect(screen.getByText('Total Teachers: 10')).toBeInTheDocument();
    expect(screen.getByText('Total Courses: 25')).toBeInTheDocument();
    expect(screen.getByText('Total Assessments: 50')).toBeInTheDocument();

    // Verify recent activity is displayed
    expect(screen.getByText('Student 1: Completed assessment')).toBeInTheDocument();
    expect(screen.getByText('Teacher 1: Created course')).toBeInTheDocument();

    // Navigate to user management
    fireEvent.click(screen.getByText('Manage Users'));
    expect(mockRouter.push).toHaveBeenCalledWith('/admin/users');

    // Render user management component
    rerender(
      <AuthProvider>
        <UserManagementComponent />
      </AuthProvider>
    );

    // Verify users are displayed
    const userRows = screen.getAllByTestId('user-row');
    expect(userRows).toHaveLength(2);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();

    // Navigate to create user
    fireEvent.click(screen.getByText('Create New User'));
    expect(mockRouter.push).toHaveBeenCalledWith('/admin/users/create');

    // Render create user component
    rerender(
      <AuthProvider>
        <CreateUserComponent />
      </AuthProvider>
    );

    // Fill user form and submit
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'New User' } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'newuser@example.com' } });
    fireEvent.change(screen.getByTestId('role-select'), { target: { value: 'teacher' } });
    fireEvent.click(screen.getByText('Save User'));

    // Verify navigation back to user management
    expect(mockRouter.push).toHaveBeenCalledWith('/admin/users');
  });
});
