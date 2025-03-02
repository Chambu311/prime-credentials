import { PublicPost, PublicPostWithComments } from "@/lib/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { ImagesService } from "../images.service";

export class PostsService {
  private supabase: SupabaseClient;
  private imageService: ImagesService;
  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
    this.imageService = new ImagesService(supabase);
  }

  async createPost(comment: string, image: File | null) {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    const imagePath = image ? await this.imageService.uploadImageToBucket(image) : null;
    const { data, error: postError } = await this.supabase.from("post").insert({
      content: comment,
      user_id: user?.id,
      user_email: user?.email,
      image: imagePath,
    });

    if (postError) {
      throw new Error(postError.message);
    }

    return data;
  }

  async getPostById(id: string): Promise<PublicPostWithComments> {
    const { data, error } = await this.supabase
      .from("post")
      .select("*, comment(*)")
      .eq("id", id)
      .single();
      
    if (error) {
      throw new Error(error.message);
    }
    const imageUrl = await this.imageService.getPostImageSignedUrl(data.image);
      for (const comment of data.comment) {
        if (comment.image) {
          const commentImageUrl = await this.imageService.getPostImageSignedUrl(comment.image);
          comment.image = commentImageUrl;
        }
      }
    return { ...data, image: imageUrl, comment: data.comment };
  }

  async getPosts() {
    const posts: PublicPost[] = [];
    const { data, error } = await this.supabase.from("post").select("*").order("created_at", { ascending: false });
    if (error) {
      throw new Error(error.message);
    }
    for (const post of data) {
      const imageUrl = await this.imageService.getPostImageSignedUrl(post.image);
      posts.push({ ...post, image: imageUrl });
    }
    return posts;
  }
}
