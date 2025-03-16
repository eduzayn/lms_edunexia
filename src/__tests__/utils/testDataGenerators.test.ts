import {
  generateUserProfile,
  generateCourse,
  generateModule,
  generateLesson,
  generateContentItem,
  generateScormPackage,
  generateLTITool,
  generateCertificate,
  generateCertificateTemplate,
  generateAchievement,
  generatePointsHistory
} from './testDataGenerators';

describe('Test Data Generators', () => {
  describe('User Profile Generator', () => {
    it('should generate a user profile with default values', () => {
      const user = generateUserProfile();
      expect(user.id).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.full_name).toBeDefined();
      expect(user.role).toBeDefined();
      expect(user.created_at).toBeDefined();
    });

    it('should generate a user profile with custom values', () => {
      const user = generateUserProfile({
        id: 'custom-id',
        email: 'custom@example.com',
        role: 'teacher'
      });
      
      expect(user.id).toBe('custom-id');
      expect(user.email).toBe('custom@example.com');
      expect(user.role).toBe('teacher');
    });
  });

  describe('Course Generator', () => {
    it('should generate a course with default values', () => {
      const course = generateCourse();
      expect(course.id).toBeDefined();
      expect(course.title).toBeDefined();
      expect(course.description).toBeDefined();
      expect(course.instructor_id).toBeDefined();
      expect(course.created_at).toBeDefined();
    });

    it('should generate a course with custom values', () => {
      const course = generateCourse({
        id: 'custom-course-id',
        title: 'Custom Course',
        instructor_id: 'custom-teacher-id'
      });
      
      expect(course.id).toBe('custom-course-id');
      expect(course.title).toBe('Custom Course');
      expect(course.instructor_id).toBe('custom-teacher-id');
    });
  });

  describe('Content Generators', () => {
    it('should generate a module with default values', () => {
      const courseId = 'course-123';
      const module = generateModule(courseId);
      expect(module.id).toBeDefined();
      expect(module.title).toBeDefined();
      expect(module.course_id).toBe(courseId);
      expect(module.order).toBeDefined();
    });

    it('should generate a lesson with default values', () => {
      const moduleId = 'module-123';
      const lesson = generateLesson(moduleId);
      expect(lesson.id).toBeDefined();
      expect(lesson.title).toBeDefined();
      expect(lesson.module_id).toBe(moduleId);
      expect(lesson.order).toBeDefined();
    });

    it('should generate a content item with default values', () => {
      const lessonId = 'lesson-123';
      const contentItem = generateContentItem(lessonId, 'text');
      expect(contentItem.id).toBeDefined();
      expect(contentItem.title).toBeDefined();
      expect(contentItem.type).toBe('text');
      expect(contentItem.lesson_id).toBe(lessonId);
    });
  });

  describe('SCORM and LTI Generators', () => {
    it('should generate a SCORM package with default values', () => {
      const contentId = 'content-123';
      const scormPackage = generateScormPackage(contentId);
      expect(scormPackage.id).toBeDefined();
      expect(scormPackage.content_id).toBe(contentId);
      expect(scormPackage.version).toBeDefined();
      expect(scormPackage.package_url).toBeDefined();
      expect(scormPackage.entry_point).toBeDefined();
    });

    it('should generate an LTI tool with default values', () => {
      const contentId = 'content-123';
      const ltiTool = generateLTITool(contentId);
      expect(ltiTool.id).toBeDefined();
      expect(ltiTool.content_id).toBe(contentId);
      expect(ltiTool.version).toBeDefined();
      expect(ltiTool.name).toBeDefined();
      expect(ltiTool.launch_url).toBeDefined();
    });
  });

  describe('Certificate Generators', () => {
    it('should generate a certificate template with default values', () => {
      const template = generateCertificateTemplate();
      expect(template.id).toBeDefined();
      expect(template.name).toBeDefined();
      expect(template.html_template).toBeDefined();
      expect(template.created_at).toBeDefined();
    });

    it('should generate a certificate with default values', () => {
      const templateId = 'template-123';
      const studentId = 'student-123';
      const courseId = 'course-123';
      const certificate = generateCertificate(templateId, studentId, courseId);
      expect(certificate.id).toBeDefined();
      expect(certificate.student_id).toBe(studentId);
      expect(certificate.course_id).toBe(courseId);
      expect(certificate.template_id).toBe(templateId);
      expect(certificate.verification_code).toBeDefined();
      expect(certificate.issue_date).toBeDefined();
    });
  });

  describe('Gamification Generators', () => {
    it('should generate an achievement with default values', () => {
      const studentId = 'student-123';
      const achievementTypeId = 'achievement-type-123';
      const achievement = generateAchievement(studentId, achievementTypeId);
      expect(achievement.id).toBeDefined();
      expect(achievement.student_id).toBe(studentId);
      expect(achievement.achievement_type_id).toBe(achievementTypeId);
      expect(achievement.earned_at).toBeDefined();
      expect(achievement.points_awarded).toBeDefined();
    });

    it('should generate a points history entry with default values', () => {
      const studentId = 'student-123';
      const transaction = generatePointsHistory(studentId);
      expect(transaction.id).toBeDefined();
      expect(transaction.student_id).toBe(studentId);
      expect(transaction.points).toBeDefined();
      expect(transaction.source_type).toBeDefined();
      expect(transaction.created_at).toBeDefined();
    });
  });
});
