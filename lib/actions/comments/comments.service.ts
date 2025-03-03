import { SupabaseClient } from "@supabase/supabase-js";
import { ImagesService } from "../images.service";

export class CommentsService {
  private imagesService: ImagesService;

  constructor(private supabase: SupabaseClient) {
    this.supabase = supabase;
    this.imagesService = new ImagesService(supabase);
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

  async createCommentWithImage(content: string, postId: string, image: File | null) {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    
    // Upload image if provided
    const imagePath = image ? await this.imagesService.uploadImageToBucket(image) : null;
    
    const { data, error } = await this.supabase.from("comment").insert({
      content: content,
      post_id: postId,
      user_id: user?.id,
      user_email: user?.email,
      image: imagePath,
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
      .eq("post_id", postId)
      .order("created_at", { ascending: false });
    if (error) {
      throw new Error(error.message);
    }
    
    // Get signed URLs for any comment images
    for (const comment of data) {
      if (comment.image) {
        comment.image = await this.imagesService.getPostImageSignedUrl(comment.image);
      }
    }
    
    return data;
  }
}
