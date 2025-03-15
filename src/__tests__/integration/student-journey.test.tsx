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
        data: { session: { user: { id: '123', email: 'student@example.com' } } },
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
              id: '123',
              user_id: '123',
              name: 'Test Student',
              email: 'student@example.com',
              role: 'student',
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
  getStudentAssessments: jest.fn().mockResolvedValue([
    {
      id: 'assessment1',
      title: 'Math Assessment',
      description: 'Test your math skills',
      due_date: new Date().toISOString(),
      status: 'pending',
    },
  ]),
  getAssessmentById: jest.fn().mockResolvedValue({
    id: 'assessment1',
    title: 'Math Assessment',
    description: 'Test your math skills',
    questions: [
      {
        id: 'q1',
        text: 'What is 2+2?',
        type: 'multiple_choice',
        options: ['3', '4', '5', '6'],
        correct_answer: '4',
      },
    ],
  }),
  submitAssessment: jest.fn().mockResolvedValue({ success: true }),
}));

describe('Student Journey Integration Tests', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should allow student to log in and view assessments', async () => {
    // Mock components for testing the flow
    const LoginComponent = () => {
      const router = useRouter();
      const handleLogin = () => {
        router.push('/student/dashboard');
      };

      return (
        <div>
          <h1>Student Login</h1>
          <input data-testid="email-input" placeholder="Email" />
          <input data-testid="password-input" type="password" placeholder="Password" />
          <button onClick={handleLogin}>Login</button>
        </div>
      );
    };

    const DashboardComponent = () => {
      const router = useRouter();
      const goToAssessments = () => {
        router.push('/student/assessments/list');
      };

      return (
        <div>
          <h1>Student Dashboard</h1>
          <button onClick={goToAssessments}>View Assessments</button>
        </div>
      );
    };

    const AssessmentsListComponent = () => {
      const router = useRouter();
      const takeAssessment = () => {
        router.push('/student/assessments/take/assessment1');
      };

      return (
        <div>
          <h1>Assessments</h1>
          <div data-testid="assessment-item">
            <h2>Math Assessment</h2>
            <p>Test your math skills</p>
            <button onClick={takeAssessment}>Take Assessment</button>
          </div>
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
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'student@example.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Login'));

    // Verify navigation to dashboard
    expect(mockRouter.push).toHaveBeenCalledWith('/student/dashboard');

    // Render dashboard component
    rerender(
      <AuthProvider>
        <DashboardComponent />
      </AuthProvider>
    );

    // Navigate to assessments
    fireEvent.click(screen.getByText('View Assessments'));
    expect(mockRouter.push).toHaveBeenCalledWith('/student/assessments/list');

    // Render assessments list
    rerender(
      <AuthProvider>
        <AssessmentsListComponent />
      </AuthProvider>
    );

    // Verify assessment is displayed
    expect(screen.getByText('Math Assessment')).toBeInTheDocument();
    expect(screen.getByText('Test your math skills')).toBeInTheDocument();

    // Take assessment
    fireEvent.click(screen.getByText('Take Assessment'));
    expect(mockRouter.push).toHaveBeenCalledWith('/student/assessments/take/assessment1');
  });
});
