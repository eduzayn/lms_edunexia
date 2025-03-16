import { createServerSupabaseClient } from "../../lib/supabase/server";

export const lytexService = {
  async enrollStudent(userId: string, courseId: string) {
    const supabase = createServerSupabaseClient();
    
    // Get user details
    const { data: user } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (!user) {
      throw new Error("User not found");
    }
    
    // Get course details
    const { data: course } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();
    
    if (!course) {
      throw new Error("Course not found");
    }
    
    // Call Lytex API to enroll student
    const response = await fetch(process.env.LYTEX_API_URL + "/enrollments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.LYTEX_API_KEY}`
      },
      body: JSON.stringify({
        student: {
          id: userId,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email
        },
        course: {
          id: courseId,
          title: course.title
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to enroll student in Lytex: ${response.statusText}`);
    }
    
    const enrollmentData = await response.json();
    
    // Create enrollment record in database
    const { data: enrollment, error } = await supabase
      .from("enrollment.enrollments")
      .insert({
        user_id: userId,
        course_id: courseId,
        status: "active",
        lytex_enrollment_id: enrollmentData.id
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create enrollment record: ${error.message}`);
    }
    
    return enrollment;
  },
  
  async getEnrollmentStatus(enrollmentId: string) {
    const supabase = createServerSupabaseClient();
    
    // Get enrollment details
    const { data: enrollment } = await supabase
      .from("enrollment.enrollments")
      .select("*")
      .eq("id", enrollmentId)
      .single();
    
    if (!enrollment) {
      throw new Error("Enrollment not found");
    }
    
    // Call Lytex API to get enrollment status
    const response = await fetch(process.env.LYTEX_API_URL + `/enrollments/${enrollment.lytex_enrollment_id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.LYTEX_API_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get enrollment status from Lytex: ${response.statusText}`);
    }
    
    const enrollmentData = await response.json();
    
    // Update enrollment record in database
    const { data: updatedEnrollment, error } = await supabase
      .from("enrollment.enrollments")
      .update({
        status: enrollmentData.status,
        progress: enrollmentData.progress,
        updated_at: new Date().toISOString()
      })
      .eq("id", enrollmentId)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to update enrollment record: ${error.message}`);
    }
    
    return updatedEnrollment;
  },
  
  async cancelEnrollment(enrollmentId: string) {
    const supabase = createServerSupabaseClient();
    
    // Get enrollment details
    const { data: enrollment } = await supabase
      .from("enrollment.enrollments")
      .select("*")
      .eq("id", enrollmentId)
      .single();
    
    if (!enrollment) {
      throw new Error("Enrollment not found");
    }
    
    // Call Lytex API to cancel enrollment
    const response = await fetch(process.env.LYTEX_API_URL + `/enrollments/${enrollment.lytex_enrollment_id}/cancel`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.LYTEX_API_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to cancel enrollment in Lytex: ${response.statusText}`);
    }
    
    // Update enrollment record in database
    const { data: updatedEnrollment, error } = await supabase
      .from("enrollment.enrollments")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString()
      })
      .eq("id", enrollmentId)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to update enrollment record: ${error.message}`);
    }
    
    return updatedEnrollment;
  },
  
  async getAllEnrollments(userId: string) {
    const supabase = createServerSupabaseClient();
    
    // Get all enrollments for user
    const { data: enrollments, error } = await supabase
      .from("enrollment.enrollments")
      .select(`
        *,
        courses:course_id (
          id,
          title,
          description,
          cover_image
        )
      `)
      .eq("user_id", userId);
    
    if (error) {
      throw new Error(`Failed to get enrollments: ${error.message}`);
    }
    
    return enrollments;
  },
  
  async syncEnrollmentsWithLytex() {
    const supabase = createServerSupabaseClient();
    
    // Get all active enrollments
    const { data: enrollments, error } = await supabase
      .from("enrollment.enrollments")
      .select("*")
      .eq("status", "active");
    
    if (error) {
      throw new Error(`Failed to get enrollments: ${error.message}`);
    }
    
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };
    
    // Update each enrollment status from Lytex
    for (const enrollment of enrollments || []) {
      try {
        if (!enrollment.lytex_enrollment_id) continue;
        
        await this.getEnrollmentStatus(enrollment.id);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Enrollment ${enrollment.id}: ${(error as Error).message}`);
      }
    }
    
    return results;
  }
};
