import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Types for forum entities
export interface Forum {
  id: string;
  title: string;
  description: string;
  course_id?: string;
  is_global: boolean;
  created_at: string;
  updated_at: string;
  post_count?: number;
  topic_count?: number;
}

export interface Topic {
  id: string;
  forum_id: string;
  title: string;
  content: string;
  author_id: string;
  is_pinned: boolean;
  is_locked: boolean;
  view_count: number;
  reply_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  last_post?: {
    id: string;
    created_at: string;
    author_id: string;
    author_name: string;
  };
}

export interface Post {
  id: string;
  topic_id: string;
  parent_id?: string;
  content: string;
  author_id: string;
  is_answer: boolean;
  like_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  replies?: Post[];
}

export class ForumService {
  private static instance: ForumService;
  private supabaseUrl: string;
  private supabaseKey: string;
  private supabase: ReturnType<typeof createClient> | null = null;

  private constructor() {
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    this.supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    if (this.supabaseUrl && this.supabaseKey) {
      this.supabase = createClient<Database>(this.supabaseUrl, this.supabaseKey);
    }
  }

  public static getInstance(): ForumService {
    if (!ForumService.instance) {
      ForumService.instance = new ForumService();
    }
    return ForumService.instance;
  }

  // Forum methods
  async getForums(courseId?: string): Promise<Forum[]> {
    if (!this.supabase) return [];

    let query = this.supabase
      .from('forums')
      .select(`
        *,
        topics:forum_topics(count),
        posts:forum_posts(count)
      `);

    if (courseId) {
      query = query.or(`course_id.eq.${courseId},is_global.eq.true`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching forums:', error);
      return [];
    }

    return data.map(forum => ({
      ...forum,
      topic_count: forum.topics?.[0]?.count || 0,
      post_count: forum.posts?.[0]?.count || 0
    }));
  }

  async getForum(id: string): Promise<Forum | null> {
    if (!this.supabase) return null;

    const { data, error } = await this.supabase
      .from('forums')
      .select(`
        *,
        topics:forum_topics(count),
        posts:forum_posts(count)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching forum:', error);
      return null;
    }

    return {
      ...data,
      topic_count: data.topics?.[0]?.count || 0,
      post_count: data.posts?.[0]?.count || 0
    };
  }

  async createForum(forum: Partial<Forum>): Promise<Forum | null> {
    if (!this.supabase) return null;

    const { data, error } = await this.supabase
      .from('forums')
      .insert({
        title: forum.title,
        description: forum.description,
        course_id: forum.course_id,
        is_global: forum.is_global || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating forum:', error);
      return null;
    }

    return data;
  }

  // Topic methods
  async getTopics(forumId: string, page = 1, limit = 10): Promise<{ topics: Topic[], total: number }> {
    if (!this.supabase) return { topics: [], total: 0 };

    // Get total count
    const { count, error: countError } = await this.supabase
      .from('forum_topics')
      .select('*', { count: 'exact', head: true })
      .eq('forum_id', forumId);

    if (countError) {
      console.error('Error counting topics:', countError);
      return { topics: [], total: 0 };
    }

    // Get paginated topics
    const { data, error } = await this.supabase
      .from('forum_topics')
      .select(`
        *,
        author:profiles(id, full_name, avatar_url),
        last_post:forum_posts(id, created_at, author_id, profiles(full_name))
      `)
      .eq('forum_id', forumId)
      .order('is_pinned', { ascending: false })
      .order('updated_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      console.error('Error fetching topics:', error);
      return { topics: [], total: 0 };
    }

    const topics = data.map(topic => ({
      ...topic,
      author: topic.author?.[0],
      last_post: topic.last_post?.[0] ? {
        ...topic.last_post[0],
        author_name: topic.last_post[0].profiles?.full_name
      } : undefined
    }));

    return { topics, total: count || 0 };
  }

  async getTopic(id: string): Promise<Topic | null> {
    if (!this.supabase) return null;

    // Increment view count
    await this.supabase.rpc('increment_topic_views', { topic_id: id });

    const { data, error } = await this.supabase
      .from('forum_topics')
      .select(`
        *,
        author:profiles(id, full_name, avatar_url)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching topic:', error);
      return null;
    }

    return {
      ...data,
      author: data.author?.[0]
    };
  }

  async createTopic(topic: Partial<Topic>): Promise<Topic | null> {
    if (!this.supabase) return null;

    const { data, error } = await this.supabase
      .from('forum_topics')
      .insert({
        forum_id: topic.forum_id,
        title: topic.title,
        content: topic.content,
        author_id: topic.author_id,
        is_pinned: topic.is_pinned || false,
        is_locked: topic.is_locked || false,
        view_count: 0,
        reply_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating topic:', error);
      return null;
    }

    return data;
  }

  async updateTopic(id: string, updates: Partial<Topic>): Promise<Topic | null> {
    if (!this.supabase) return null;

    const { data, error } = await this.supabase
      .from('forum_topics')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating topic:', error);
      return null;
    }

    return data;
  }

  // Post methods
  async getPosts(topicId: string): Promise<Post[]> {
    if (!this.supabase) return [];

    // First get all posts for this topic
    const { data, error } = await this.supabase
      .from('forum_posts')
      .select(`
        *,
        author:profiles(id, full_name, avatar_url)
      `)
      .eq('topic_id', topicId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }

    // Organize into threads (parent posts and their replies)
    const posts = data.map(post => ({
      ...post,
      author: post.author?.[0],
      replies: []
    }));

    // Create a map for quick lookup
    const postsMap = new Map<string, Post>();
    posts.forEach(post => {
      postsMap.set(post.id, post);
    });

    // Organize into threads
    const rootPosts: Post[] = [];
    posts.forEach(post => {
      if (post.parent_id) {
        const parentPost = postsMap.get(post.parent_id);
        if (parentPost) {
          if (!parentPost.replies) {
            parentPost.replies = [];
          }
          parentPost.replies.push(post);
        } else {
          rootPosts.push(post);
        }
      } else {
        rootPosts.push(post);
      }
    });

    return rootPosts;
  }

  async createPost(post: Partial<Post>): Promise<Post | null> {
    if (!this.supabase) return null;

    const { data, error } = await this.supabase
      .from('forum_posts')
      .insert({
        topic_id: post.topic_id,
        parent_id: post.parent_id,
        content: post.content,
        author_id: post.author_id,
        is_answer: post.is_answer || false,
        like_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return null;
    }

    // Update topic's reply count and last update time
    await this.supabase
      .from('forum_topics')
      .update({
        reply_count: this.supabase.rpc('increment_counter', { row_id: post.topic_id }),
        updated_at: new Date().toISOString()
      })
      .eq('id', post.topic_id);

    return data;
  }

  async updatePost(id: string, updates: Partial<Post>): Promise<Post | null> {
    if (!this.supabase) return null;

    const { data, error } = await this.supabase
      .from('forum_posts')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating post:', error);
      return null;
    }

    return data;
  }

  async likePost(id: string): Promise<boolean> {
    if (!this.supabase) return false;

    const { error } = await this.supabase
      .from('forum_posts')
      .update({
        like_count: this.supabase.rpc('increment_counter', { row_id: id })
      })
      .eq('id', id);

    if (error) {
      console.error('Error liking post:', error);
      return false;
    }

    return true;
  }

  async markAsAnswer(id: string, topicId: string): Promise<boolean> {
    if (!this.supabase) return false;

    // First, unmark any existing answers
    await this.supabase
      .from('forum_posts')
      .update({ is_answer: false })
      .eq('topic_id', topicId)
      .eq('is_answer', true);

    // Then mark this post as the answer
    const { error } = await this.supabase
      .from('forum_posts')
      .update({ is_answer: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking post as answer:', error);
      return false;
    }

    return true;
  }
}

export const forumService = ForumService.getInstance();
