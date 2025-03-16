/**
 * Test Data Generators
 * 
 * This utility provides functions to generate test data for various entities
 * in the LMS Edunexia application, making it easier to create consistent test fixtures.
 */

import { v4 as uuidv4 } from 'uuid';

// Helper to generate a random date within a range
export function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper to generate a random string
export function randomString(length: number = 10): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

// Helper to generate a random number within a range
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to generate a random boolean
export function randomBoolean(): boolean {
  return Math.random() > 0.5;
}

// Helper to pick a random item from an array
export function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

// User Profile
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'student' | 'teacher' | 'admin';
  created_at: string;
  updated_at: string;
}

// Generate a random user profile
export function generateUserProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  const firstName = randomItem(['John', 'Jane', 'Bob', 'Alice', 'David', 'Maria', 'Carlos', 'Ana']);
  const lastName = randomItem(['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis']);
  
  return {
    id: uuidv4(),
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    full_name: `${firstName} ${lastName}`,
    avatar_url: `https://i.pravatar.cc/150?u=${uuidv4()}`,
    role: randomItem(['student', 'teacher', 'admin']),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  };
}

// Course
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  cover_image?: string;
  status: 'draft' | 'published' | 'archived';
  price: number;
  duration_hours: number;
  created_at: string;
  updated_at: string;
}

// Generate a random course
export function generateCourse(overrides: Partial<Course> = {}): Course {
  const subjects = ['Mathematics', 'Science', 'History', 'English', 'Computer Science', 'Art', 'Music', 'Physical Education'];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const title = `${randomItem(subjects)} ${randomItem(levels)}`;
  
  return {
    id: uuidv4(),
    title,
    description: `This is a course about ${title.toLowerCase()}`,
    instructor_id: uuidv4(),
    cover_image: `https://picsum.photos/seed/${randomString(5)}/800/400`,
    status: randomItem(['draft', 'published', 'archived']),
    price: randomNumber(0, 100) * 10,
    duration_hours: randomNumber(10, 100),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  };
}

// Module
export interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order: number;
  created_at: string;
  updated_at: string;
}

// Generate a random module
export function generateModule(courseId: string, overrides: Partial<Module> = {}): Module {
  return {
    id: uuidv4(),
    course_id: courseId,
    title: `Module ${randomNumber(1, 10)}`,
    description: `This is a module description for ${randomString(10)}`,
    order: randomNumber(1, 10),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  };
}

// Lesson
export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  order: number;
  duration_minutes: number;
  created_at: string;
  updated_at: string;
}

// Generate a random lesson
export function generateLesson(moduleId: string, overrides: Partial<Lesson> = {}): Lesson {
  return {
    id: uuidv4(),
    module_id: moduleId,
    title: `Lesson ${randomNumber(1, 10)}`,
    description: `This is a lesson description for ${randomString(10)}`,
    order: randomNumber(1, 10),
    duration_minutes: randomNumber(10, 60),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  };
}

// Content Item
export interface ContentItem {
  id: string;
  lesson_id: string;
  title: string;
  description?: string;
  type: 'text' | 'video' | 'scorm' | 'lti' | 'quiz';
  content?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Generate a random content item
export function generateContentItem(
  lessonId: string, 
  type: 'text' | 'video' | 'scorm' | 'lti' | 'quiz',
  overrides: Partial<ContentItem> = {}
): ContentItem {
  const baseContent = {
    id: uuidv4(),
    lesson_id: lessonId,
    title: `${type.charAt(0).toUpperCase() + type.slice(1)} Content ${randomNumber(1, 100)}`,
    description: `This is a ${type} content description`,
    type,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  let metadata: Record<string, any> = {};
  let content: string | undefined;
  
  switch (type) {
    case 'text':
      content = `<p>This is a sample text content with <strong>formatting</strong>.</p><p>It has multiple paragraphs.</p>`;
      break;
    case 'video':
      metadata = {
        videoUrl: 'https://example.com/videos/sample.mp4',
        duration: randomNumber(60, 3600),
        thumbnailUrl: 'https://example.com/thumbnails/sample.jpg'
      };
      break;
    case 'scorm':
      metadata = {
        scorm: {
          version: randomItem(['1.2', '2004']),
          packageUrl: 'https://example.com/scorm/package.zip',
          entryPoint: 'index.html'
        }
      };
      break;
    case 'lti':
      metadata = {
        lti: {
          version: '1.3',
          launchUrl: 'https://example.com/lti/launch',
          clientId: `client-${randomString(8)}`,
          deploymentId: `deployment-${randomString(8)}`,
          platformId: 'https://platform.example.com'
        }
      };
      break;
    case 'quiz':
      metadata = {
        quiz: {
          questions: [
            {
              id: uuidv4(),
              text: 'What is the capital of France?',
              type: 'multiple_choice',
              options: [
                { id: uuidv4(), text: 'Paris', isCorrect: true },
                { id: uuidv4(), text: 'London', isCorrect: false },
                { id: uuidv4(), text: 'Berlin', isCorrect: false },
                { id: uuidv4(), text: 'Madrid', isCorrect: false }
              ]
            }
          ],
          timeLimit: randomNumber(5, 30),
          passingScore: 70
        }
      };
      break;
  }
  
  return {
    ...baseContent,
    content,
    metadata,
    ...overrides
  };
}

// SCORM Package
export interface ScormPackage {
  id: string;
  content_id: string;
  version: '1.2' | '2004';
  package_url: string;
  manifest_url: string;
  entry_point: string;
  created_at: string;
  updated_at: string;
}

// Generate a random SCORM package
export function generateScormPackage(contentId: string, overrides: Partial<ScormPackage> = {}): ScormPackage {
  return {
    id: uuidv4(),
    content_id: contentId,
    version: randomItem(['1.2', '2004']),
    package_url: `https://example.com/scorm/${randomString(8)}.zip`,
    manifest_url: `https://example.com/scorm/${randomString(8)}/imsmanifest.xml`,
    entry_point: `https://example.com/scorm/${randomString(8)}/index.html`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  };
}

// LTI Tool
export interface LTITool {
  id: string;
  content_id: string;
  version: string;
  name: string;
  description?: string;
  launch_url: string;
  client_id: string;
  deployment_id: string;
  platform_id: string;
  created_at: string;
  updated_at: string;
}

// Generate a random LTI tool
export function generateLTITool(contentId: string, overrides: Partial<LTITool> = {}): LTITool {
  return {
    id: uuidv4(),
    content_id: contentId,
    version: '1.3',
    name: `LTI Tool ${randomNumber(1, 100)}`,
    description: `This is an LTI tool description for ${randomString(10)}`,
    launch_url: `https://example.com/lti/${randomString(8)}/launch`,
    client_id: `client-${randomString(8)}`,
    deployment_id: `deployment-${randomString(8)}`,
    platform_id: 'https://platform.example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  };
}

// Certificate Template
export interface CertificateTemplate {
  id: string;
  name: string;
  description: string;
  html_template: string;
  css_styles: string;
  variables: string[];
  created_at: string;
  updated_at: string;
}

// Generate a random certificate template
export function generateCertificateTemplate(overrides: Partial<CertificateTemplate> = {}): CertificateTemplate {
  return {
    id: uuidv4(),
    name: `Certificate Template ${randomNumber(1, 100)}`,
    description: `This is a certificate template description for ${randomString(10)}`,
    html_template: '<div class="certificate">{{student_name}} has completed {{course_name}} on {{completion_date}}</div>',
    css_styles: '.certificate { border: 1px solid #000; padding: 20px; text-align: center; }',
    variables: ['student_name', 'course_name', 'completion_date'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  };
}

// Certificate
export interface Certificate {
  id: string;
  template_id: string;
  student_id: string;
  course_id: string;
  issue_date: string;
  expiry_date?: string;
  verification_code: string;
  data: Record<string, string>;
  status: 'active' | 'revoked' | 'expired';
  created_at: string;
  updated_at: string;
}

// Generate a random certificate
export function generateCertificate(
  templateId: string,
  studentId: string,
  courseId: string,
  overrides: Partial<Certificate> = {}
): Certificate {
  const issueDate = new Date();
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 5);
  
  return {
    id: uuidv4(),
    template_id: templateId,
    student_id: studentId,
    course_id: courseId,
    issue_date: issueDate.toISOString(),
    expiry_date: expiryDate.toISOString(),
    verification_code: randomString(16),
    data: {
      student_name: 'John Doe',
      course_name: 'Advanced Web Development',
      completion_date: issueDate.toLocaleDateString('pt-BR')
    },
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  };
}

// Achievement Type
export interface AchievementType {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  requirements: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Generate a random achievement type
export function generateAchievementType(overrides: Partial<AchievementType> = {}): AchievementType {
  const achievementTypes = [
    {
      name: 'Course Completion',
      description: 'Awarded when a student completes a course',
      icon: 'graduation-cap',
      points: 100,
      requirements: { progress_percentage: 100 }
    },
    {
      name: 'Perfect Score',
      description: 'Awarded for getting 100% on an assessment',
      icon: 'star',
      points: 150,
      requirements: { score: 100 }
    },
    {
      name: 'Login Streak',
      description: 'Awarded for logging in consistently',
      icon: 'calendar-check',
      points: 50,
      requirements: { days: 7 }
    },
    {
      name: 'Forum Contributor',
      description: 'Awarded for posting in the forums',
      icon: 'comments',
      points: 75,
      requirements: { posts: 10 }
    }
  ];
  
  const baseType = randomItem(achievementTypes);
  
  return {
    id: uuidv4(),
    name: baseType.name,
    description: baseType.description,
    icon: baseType.icon,
    points: baseType.points,
    requirements: baseType.requirements,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  };
}

// Achievement
export interface Achievement {
  id: string;
  student_id: string;
  achievement_type_id: string;
  earned_at: string;
  points_awarded: number;
  data: Record<string, any>;
  type?: AchievementType;
  created_at: string;
  updated_at: string;
}

// Generate a random achievement
export function generateAchievement(
  studentId: string,
  achievementTypeId: string,
  achievementType?: AchievementType,
  overrides: Partial<Achievement> = {}
): Achievement {
  let data: Record<string, any> = {};
  let points = 100;
  
  if (achievementType) {
    points = achievementType.points;
    
    switch (achievementType.name) {
      case 'Course Completion':
        data = {
          course_id: uuidv4(),
          course_name: 'Introduction to Web Development'
        };
        break;
      case 'Perfect Score':
        data = {
          assessment_id: uuidv4(),
          assessment_name: 'Final Exam'
        };
        break;
      case 'Login Streak':
        data = {
          days: 7
        };
        break;
      case 'Forum Contributor':
        data = {
          posts: 10
        };
        break;
    }
  }
  
  return {
    id: uuidv4(),
    student_id: studentId,
    achievement_type_id: achievementTypeId,
    earned_at: new Date().toISOString(),
    points_awarded: points,
    data,
    type: achievementType,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  };
}

// Points History
export interface PointsHistory {
  id: string;
  student_id: string;
  points: number;
  source_type: 'achievement' | 'assessment' | 'course' | 'manual';
  source_id: string;
  description: string;
  created_at: string;
}

// Generate a random points history entry
export function generatePointsHistory(
  studentId: string,
  overrides: Partial<PointsHistory> = {}
): PointsHistory {
  const sourceTypes = ['achievement', 'assessment', 'course', 'manual'];
  const sourceType = randomItem(sourceTypes) as 'achievement' | 'assessment' | 'course' | 'manual';
  
  let description = '';
  let points = randomNumber(10, 200);
  
  switch (sourceType) {
    case 'achievement':
      description = 'Earned achievement: Course Completion';
      points = 100;
      break;
    case 'assessment':
      description = 'Completed assessment with high score';
      points = randomNumber(50, 150);
      break;
    case 'course':
      description = 'Completed course module';
      points = randomNumber(20, 100);
      break;
    case 'manual':
      description = 'Bonus points awarded by instructor';
      points = randomNumber(10, 50);
      break;
  }
  
  return {
    id: uuidv4(),
    student_id: studentId,
    points,
    source_type: sourceType,
    source_id: uuidv4(),
    description,
    created_at: new Date().toISOString(),
    ...overrides
  };
}

// Student Level
export interface StudentLevel {
  level: number;
  points: number;
  points_to_next_level: number;
  total_points_needed: number;
  progress_percentage: number;
}

// Generate a student level
export function generateStudentLevel(overrides: Partial<StudentLevel> = {}): StudentLevel {
  const level = randomNumber(1, 10);
  const pointsPerLevel = 100;
  const points = level * pointsPerLevel - randomNumber(0, pointsPerLevel - 1);
  const pointsToNextLevel = (level + 1) * pointsPerLevel - points;
  const totalPointsNeeded = (level + 1) * pointsPerLevel;
  const progressPercentage = Math.floor((points % pointsPerLevel) / pointsPerLevel * 100);
  
  return {
    level,
    points,
    points_to_next_level: pointsToNextLevel,
    total_points_needed: totalPointsNeeded,
    progress_percentage: progressPercentage,
    ...overrides
  };
}

// Leaderboard Entry
export interface LeaderboardEntry {
  student_id: string;
  full_name: string;
  points: number;
  level: number;
  rank: number;
}

// Generate a leaderboard
export function generateLeaderboard(count: number = 10): LeaderboardEntry[] {
  const leaderboard: LeaderboardEntry[] = [];
  
  for (let i = 0; i < count; i++) {
    const points = randomNumber(100, 1000);
    const level = Math.floor(points / 100) + 1;
    
    leaderboard.push({
      student_id: uuidv4(),
      full_name: `${randomItem(['John', 'Jane', 'Bob', 'Alice', 'David', 'Maria', 'Carlos', 'Ana'])} ${randomItem(['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'])}`,
      points,
      level,
      rank: i + 1
    });
  }
  
  // Sort by points in descending order
  leaderboard.sort((a, b) => b.points - a.points);
  
  // Update ranks
  leaderboard.forEach((entry, index) => {
    entry.rank = index + 1;
  });
  
  return leaderboard;
}
