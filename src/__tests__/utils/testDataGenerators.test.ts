import {
  generateUser,
  generateCourse,
  generateModule,
  generateLesson,
  generateContentItem,
  generateScormPackage,
  generateLtiTool,
  generateCertificate,
  generateCertificateTemplate,
  generateAchievement,
  generatePointsTransaction
} from './testDataGenerators';

describe('Test Data Generators', () => {
  describe('User Generator', () => {
    it('should generate a user with default values', () => {
      const user = generateUser();
      expect(user.id).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.first_name).toBeDefined();
      expect(user.last_name).toBeDefined();
      expect(user.role).toBeDefined();
    });

    it('should generate a user with custom values', () => {
      const user = generateUser({
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
      expect(course.name).toBeDefined();
      expect(course.description).toBeDefined();
      expect(course.teacher_id).toBeDefined();
      expect(course.created_at).toBeDefined();
    });

    it('should generate a course with custom values', () => {
      const course = generateCourse({
        id: 'custom-course-id',
        name: 'Custom Course',
        teacher_id: 'custom-teacher-id'
      });
      
      expect(course.id).toBe('custom-course-id');
      expect(course.name).toBe('Custom Course');
      expect(course.teacher_id).toBe('custom-teacher-id');
    });
  });

  describe('Content Generators', () => {
    it('should generate a module with default values', () => {
      const module = generateModule();
      expect(module.id).toBeDefined();
      expect(module.name).toBeDefined();
      expect(module.course_id).toBeDefined();
      expect(module.order).toBeDefined();
    });

    it('should generate a lesson with default values', () => {
      const lesson = generateLesson();
      expect(lesson.id).toBeDefined();
      expect(lesson.title).toBeDefined();
      expect(lesson.module_id).toBeDefined();
      expect(lesson.order).toBeDefined();
    });

    it('should generate a content item with default values', () => {
      const contentItem = generateContentItem();
      expect(contentItem.id).toBeDefined();
      expect(contentItem.title).toBeDefined();
      expect(contentItem.type).toBeDefined();
      expect(contentItem.lesson_id).toBeDefined();
      expect(contentItem.course_id).toBeDefined();
    });
  });

  describe('SCORM and LTI Generators', () => {
    it('should generate a SCORM package with default values', () => {
      const scormPackage = generateScormPackage();
      expect(scormPackage.id).toBeDefined();
      expect(scormPackage.content_id).toBeDefined();
      expect(scormPackage.version).toBeDefined();
      expect(scormPackage.package_url).toBeDefined();
      expect(scormPackage.entry_point).toBeDefined();
    });

    it('should generate an LTI tool with default values', () => {
      const ltiTool = generateLtiTool();
      expect(ltiTool.id).toBeDefined();
      expect(ltiTool.content_id).toBeDefined();
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
      const certificate = generateCertificate();
      expect(certificate.id).toBeDefined();
      expect(certificate.student_id).toBeDefined();
      expect(certificate.course_id).toBeDefined();
      expect(certificate.template_id).toBeDefined();
      expect(certificate.certificate_number).toBeDefined();
      expect(certificate.verification_hash).toBeDefined();
    });
  });

  describe('Gamification Generators', () => {
    it('should generate an achievement with default values', () => {
      const achievement = generateAchievement();
      expect(achievement.id).toBeDefined();
      expect(achievement.name).toBeDefined();
      expect(achievement.description).toBeDefined();
      expect(achievement.icon).toBeDefined();
      expect(achievement.points).toBeDefined();
    });

    it('should generate a points transaction with default values', () => {
      const transaction = generatePointsTransaction();
      expect(transaction.id).toBeDefined();
      expect(transaction.user_id).toBeDefined();
      expect(transaction.points).toBeDefined();
      expect(transaction.type).toBeDefined();
      expect(transaction.created_at).toBeDefined();
    });
  });
});
