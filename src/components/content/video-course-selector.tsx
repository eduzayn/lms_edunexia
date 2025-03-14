import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Check, ChevronDown } from "lucide-react";

interface Course {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
}

interface VideoCourseSelectorProps {
  courses: Course[];
  onSelect: (courseId: string, lessonId: string) => void;
  selectedCourseId?: string;
  selectedLessonId?: string;
}

export function VideoCourseSelector({
  courses,
  onSelect,
  selectedCourseId,
  selectedLessonId
}: VideoCourseSelectorProps) {
  const [isCoursesOpen, setIsCoursesOpen] = React.useState(false);
  const [isLessonsOpen, setIsLessonsOpen] = React.useState(false);
  
  const selectedCourse = selectedCourseId 
    ? courses.find(course => course.id === selectedCourseId)
    : undefined;
    
  const selectedLesson = selectedCourse && selectedLessonId
    ? selectedCourse.lessons.find(lesson => lesson.id === selectedLessonId)
    : undefined;
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Associar a Curso</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between"
              onClick={() => setIsCoursesOpen(!isCoursesOpen)}
            >
              <span>{selectedCourse ? selectedCourse.title : "Selecione um curso"}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
            
            {isCoursesOpen && (
              <div className="absolute z-10 w-full mt-1 bg-popover rounded-md border shadow-md">
                <div className="py-1 max-h-60 overflow-auto">
                  {courses.map((course) => (
                    <button
                      key={course.id}
                      type="button"
                      className={`w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground ${
                        selectedCourseId === course.id ? "bg-accent/50" : ""
                      }`}
                      onClick={() => {
                        onSelect(course.id, "");
                        setIsCoursesOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        <span className="flex-1">{course.title}</span>
                        {selectedCourseId === course.id && (
                          <Check className="h-4 w-4" />
                        )}
                      </div>
                    </button>
                  ))}
                  
                  {courses.length === 0 && (
                    <div className="px-3 py-2 text-muted-foreground">
                      Nenhum curso encontrado
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {selectedCourse && (
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between"
                onClick={() => setIsLessonsOpen(!isLessonsOpen)}
                disabled={!selectedCourse}
              >
                <span>{selectedLesson ? selectedLesson.title : "Selecione uma aula"}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
              
              {isLessonsOpen && (
                <div className="absolute z-10 w-full mt-1 bg-popover rounded-md border shadow-md">
                  <div className="py-1 max-h-60 overflow-auto">
                    {selectedCourse.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        type="button"
                        className={`w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground ${
                          selectedLessonId === lesson.id ? "bg-accent/50" : ""
                        }`}
                        onClick={() => {
                          onSelect(selectedCourseId, lesson.id);
                          setIsLessonsOpen(false);
                        }}
                      >
                        <div className="flex items-center">
                          <span className="flex-1">{lesson.title}</span>
                          {selectedLessonId === lesson.id && (
                            <Check className="h-4 w-4" />
                          )}
                        </div>
                      </button>
                    ))}
                    
                    {selectedCourse.lessons.length === 0 && (
                      <div className="px-3 py-2 text-muted-foreground">
                        Nenhuma aula encontrada
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {selectedCourse && selectedLesson && (
            <div className="text-sm text-green-600 mt-2">
              Vídeo será associado a: {selectedCourse.title} &gt; {selectedLesson.title}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
