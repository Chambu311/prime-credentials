"use server";

import { createClient } from "@/lib/supabase/server";
import { PostsService } from "./posts.service";


export async function createPost(formData: FormData) {
  try {
    // Create the client inside the function
    const supabase = await createClient();
    const postsService = new PostsService(supabase);
    
    const comment = formData.get("content") as string; // Changed from "comment" to "content"
    const image = formData.get("image") as File;
    
    const data = await postsService.createPost(comment, image);
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

export async function getPosts() {
  try {
    // Create the client inside the function
    const supabase = await createClient();
    const postsService = new PostsService(supabase);
    
    const data = await postsService.getPosts();
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


export async function getPostById(id: string) {
  try {
    const supabase = await createClient();
    const postsService = new PostsService(supabase);
    const data = await postsService.getPostById(id);
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
