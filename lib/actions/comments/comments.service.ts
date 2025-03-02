import { SupabaseClient } from "@supabase/supabase-js";

export class CommentsService {
  constructor(private supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async createComment(content: string, postId: string) {
    console.log(content, postId);
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    const { data, error } = await this.supabase.from("comment").insert({
      content: content,
      post_id: postId,
      user_id: user?.id,
      user_email: user?.email,
    });
    if (error) {
      console.error(error.message);
      throw new Error(error.message);
    }
    return data;
  }

  async getCommentsByPostId(postId: string) {
    const { data, error } = await this.supabase
      .from("comment")
      .select("*")
      .eq("post_id", postId);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
}
