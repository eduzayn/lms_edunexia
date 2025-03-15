import { NextRequest, NextResponse } from 'next/server';
import { POST, GET } from '../route';
import { studentFeedbackService } from '../../../../../lib/services/student-feedback-service';

// Mock the student feedback service
jest.mock('../../../../../lib/services/student-feedback-service', () => ({
  studentFeedbackService: {
    generateFeedback: jest.fn(),
    getFeedback: jest.fn(),
    listFeedbackByStudent: jest.fn(),
  },
}));

describe('Student Feedback API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('should generate feedback successfully', async () => {
      // Mock request
      const request = {
        json: jest.fn().mockResolvedValue({
          studentId: 'student-123',
          activityId: 'activity-123',
          submissionId: 'submission-123',
          content: 'This is my submission',
          courseId: 'course-123',
          lessonId: 'lesson-123',
        }),
      } as unknown as NextRequest;

      // Mock service response
      const mockResponse = {
        success: true,
        data: {
          id: 'feedback-123',
          studentId: 'student-123',
          activityId: 'activity-123',
          submissionId: 'submission-123',
          feedback: 'Great job!',
          score: 9,
          strengths: ['Clear explanation', 'Good examples'],
          improvements: ['Add more details'],
        },
      };
      (studentFeedbackService.generateFeedback as jest.Mock).mockResolvedValue(mockResponse);

      // Mock NextResponse.json
      const jsonSpy = jest.spyOn(NextResponse, 'json');

      // Call the API
      await POST(request);

      // Verify service was called with correct parameters
      expect(studentFeedbackService.generateFeedback).toHaveBeenCalledWith({
        studentId: 'student-123',
        activityId: 'activity-123',
        submissionId: 'submission-123',
        content: 'This is my submission',
        courseId: 'course-123',
        lessonId: 'lesson-123',
      });

      // Verify response
      expect(jsonSpy).toHaveBeenCalledWith(mockResponse.data);
    });

    it('should return 400 if required fields are missing', async () => {
      // Mock request with missing fields
      const request = {
        json: jest.fn().mockResolvedValue({
          studentId: 'student-123',
          // Missing activityId, submissionId, content
        }),
      } as unknown as NextRequest;

      // Mock NextResponse.json
      const jsonSpy = jest.spyOn(NextResponse, 'json');

      // Call the API
      await POST(request);

      // Verify response
      expect(jsonSpy).toHaveBeenCalledWith(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    });

    it('should return 500 if service fails', async () => {
      // Mock request
      const request = {
        json: jest.fn().mockResolvedValue({
          studentId: 'student-123',
          activityId: 'activity-123',
          submissionId: 'submission-123',
          content: 'This is my submission',
        }),
      } as unknown as NextRequest;

      // Mock service error
      const mockError = {
        success: false,
        error: 'Service error',
      };
      (studentFeedbackService.generateFeedback as jest.Mock).mockResolvedValue(mockError);

      // Mock NextResponse.json
      const jsonSpy = jest.spyOn(NextResponse, 'json');

      // Call the API
      await POST(request);

      // Verify response
      expect(jsonSpy).toHaveBeenCalledWith(
        { error: 'Service error' },
        { status: 500 }
      );
    });
  });

  describe('GET', () => {
    it('should get feedback by submissionId', async () => {
      // Mock request with submissionId
      const request = {
        nextUrl: {
          searchParams: new URLSearchParams('submissionId=submission-123'),
        },
      } as unknown as NextRequest;

      // Mock service response
      const mockResponse = {
        success: true,
        data: {
          id: 'feedback-123',
          studentId: 'student-123',
          activityId: 'activity-123',
          submissionId: 'submission-123',
          feedback: 'Great job!',
          score: 9,
          strengths: ['Clear explanation', 'Good examples'],
          improvements: ['Add more details'],
        },
      };
      (studentFeedbackService.getFeedback as jest.Mock).mockResolvedValue(mockResponse);

      // Mock NextResponse.json
      const jsonSpy = jest.spyOn(NextResponse, 'json');

      // Call the API
      await GET(request);

      // Verify service was called with correct parameters
      expect(studentFeedbackService.getFeedback).toHaveBeenCalledWith('submission-123');

      // Verify response
      expect(jsonSpy).toHaveBeenCalledWith(mockResponse.data);
    });

    it('should list feedback by studentId', async () => {
      // Mock request with studentId
      const request = {
        nextUrl: {
          searchParams: new URLSearchParams('studentId=student-123'),
        },
      } as unknown as NextRequest;

      // Mock service response
      const mockResponse = {
        success: true,
        data: [
          {
            id: 'feedback-123',
            studentId: 'student-123',
            activityId: 'activity-123',
            submissionId: 'submission-123',
            feedback: 'Great job!',
            score: 9,
            strengths: ['Clear explanation', 'Good examples'],
            improvements: ['Add more details'],
          },
        ],
      };
      (studentFeedbackService.listFeedbackByStudent as jest.Mock).mockResolvedValue(mockResponse);

      // Mock NextResponse.json
      const jsonSpy = jest.spyOn(NextResponse, 'json');

      // Call the API
      await GET(request);

      // Verify service was called with correct parameters
      expect(studentFeedbackService.listFeedbackByStudent).toHaveBeenCalledWith('student-123');

      // Verify response
      expect(jsonSpy).toHaveBeenCalledWith(mockResponse.data);
    });

    it('should return 400 if neither submissionId nor studentId is provided', async () => {
      // Mock request with no parameters
      const request = {
        nextUrl: {
          searchParams: new URLSearchParams(''),
        },
      } as unknown as NextRequest;

      // Mock NextResponse.json
      const jsonSpy = jest.spyOn(NextResponse, 'json');

      // Call the API
      await GET(request);

      // Verify response
      expect(jsonSpy).toHaveBeenCalledWith(
        { error: 'Either submissionId or studentId is required' },
        { status: 400 }
      );
    });
  });
});
