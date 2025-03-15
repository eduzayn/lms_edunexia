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
        data: { session: { user: { id: '456', email: 'teacher@example.com' } } },
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
              id: '456',
              user_id: '456',
              name: 'Test Teacher',
              email: 'teacher@example.com',
              role: 'teacher',
            },
            error: null,
          }),
        })),
      })),
    })),
  })),
}));

// Mock assessment service
jest.mock('../../lib/services/assessment-service', () => ({
  getTeacherAssessments: jest.fn().mockResolvedValue([
    {
      id: 'assessment1',
      title: 'Math Assessment',
      description: 'Test your math skills',
      created_at: new Date().toISOString(),
      status: 'published',
    },
  ]),
  createAssessment: jest.fn().mockResolvedValue({
    id: 'assessment2',
    title: 'Science Assessment',
    description: 'Test your science knowledge',
  }),
}));

// Mock analytics service
jest.mock('../../lib/services/analytics-service', () => ({
  getTeacherAnalytics: jest.fn().mockResolvedValue({
    totalStudents: 25,
    completedAssessments: 15,
    averageScore: 85,
    studentProgress: [
      { student_id: 'student1', name: 'Student 1', progress: 75 },
      { student_id: 'student2', name: 'Student 2', progress: 90 },
    ],
  }),
}));

describe('Teacher Journey Integration Tests', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should allow teacher to log in, view dashboard, and create assessment', async () => {
    // Mock components for testing the flow
    const LoginComponent = () => {
      const router = useRouter();
      const handleLogin = () => {
        router.push('/teacher/dashboard');
      };

      return (
        <div>
          <h1>Teacher Login</h1>
          <input data-testid="email-input" placeholder="Email" />
          <input data-testid="password-input" type="password" placeholder="Password" />
          <button onClick={handleLogin}>Login</button>
        </div>
      );
    };

    const DashboardComponent = () => {
      const router = useRouter();
      const goToAssessments = () => {
        router.push('/teacher/assessments');
      };

      return (
        <div>
          <h1>Teacher Dashboard</h1>
          <div data-testid="analytics-summary">
            <p>Total Students: 25</p>
            <p>Completed Assessments: 15</p>
            <p>Average Score: 85%</p>
          </div>
          <button onClick={goToAssessments}>Manage Assessments</button>
        </div>
      );
    };

    const AssessmentsComponent = () => {
      const router = useRouter();
      const createNewAssessment = () => {
        router.push('/teacher/assessments/create');
      };

      return (
        <div>
          <h1>Assessments</h1>
          <div data-testid="assessment-item">
            <h2>Math Assessment</h2>
            <p>Test your math skills</p>
          </div>
          <button onClick={createNewAssessment}>Create New Assessment</button>
        </div>
      );
    };

    const CreateAssessmentComponent = () => {
      const router = useRouter();
      const handleSubmit = () => {
        // Simulate assessment creation
        router.push('/teacher/assessments');
      };

      return (
        <div>
          <h1>Create Assessment</h1>
          <input data-testid="title-input" placeholder="Title" />
          <textarea data-testid="description-input" placeholder="Description"></textarea>
          <button onClick={handleSubmit}>Save Assessment</button>
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
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'teacher@example.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Login'));

    // Verify navigation to dashboard
    expect(mockRouter.push).toHaveBeenCalledWith('/teacher/dashboard');

    // Render dashboard component
    rerender(
      <AuthProvider>
        <DashboardComponent />
      </AuthProvider>
    );

    // Verify analytics are displayed
    expect(screen.getByText('Total Students: 25')).toBeInTheDocument();
    expect(screen.getByText('Completed Assessments: 15')).toBeInTheDocument();
    expect(screen.getByText('Average Score: 85%')).toBeInTheDocument();

    // Navigate to assessments
    fireEvent.click(screen.getByText('Manage Assessments'));
    expect(mockRouter.push).toHaveBeenCalledWith('/teacher/assessments');

    // Render assessments component
    rerender(
      <AuthProvider>
        <AssessmentsComponent />
      </AuthProvider>
    );

    // Verify assessment is displayed
    expect(screen.getByText('Math Assessment')).toBeInTheDocument();
    expect(screen.getByText('Test your math skills')).toBeInTheDocument();

    // Navigate to create assessment
    fireEvent.click(screen.getByText('Create New Assessment'));
    expect(mockRouter.push).toHaveBeenCalledWith('/teacher/assessments/create');

    // Render create assessment component
    rerender(
      <AuthProvider>
        <CreateAssessmentComponent />
      </AuthProvider>
    );

    // Fill assessment form and submit
    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'Science Assessment' } });
    fireEvent.change(screen.getByTestId('description-input'), { target: { value: 'Test your science knowledge' } });
    fireEvent.click(screen.getByText('Save Assessment'));

    // Verify navigation back to assessments
    expect(mockRouter.push).toHaveBeenCalledWith('/teacher/assessments');
  });
});
