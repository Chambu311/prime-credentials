"use server";

import { CommentsService } from "./comments.service";
import { createClient } from "@/lib/supabase/server";

export async function createComment(formData: FormData, postId: string) {
  try {
    const supabase = await createClient();
    const commentsService = new CommentsService(supabase);
    const content = formData.get("content") as string;
    const image = formData.get("image") as File;
    const data = await commentsService.createComment(content, postId, image);
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
