"use server";

import { CommentsService } from "./comments.service";
import { createClient } from "@/lib/supabase/server";

export async function createComment(content: string, postId: string) {
  try {
    const supabase = await createClient();
    const commentsService = new CommentsService(supabase);
    const data = await commentsService.createComment(content, postId);
    return {
      data: data,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      error: error,
      data: null,
    };
  }
}
export async function getCommentsByPostId(postId: string) {
  try {
    const supabase = await createClient();
    const commentsService = new CommentsService(supabase);
    const data = await commentsService.getCommentsByPostId(postId);
    return {
      data: data,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      error: error,
      data: null,
    };
  }
}
