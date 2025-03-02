import { SupabaseClient } from "@supabase/supabase-js";
import { ImagesService } from "../images.service";

export class CommentsService {
  private supabase: SupabaseClient;
  private imageService: ImagesService;
  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
    this.imageService = new ImagesService(supabase);
  }

  async createComment(content: string, postId: string, image: File | null) {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    const imagePath = image ? await this.imageService.uploadImageToBucket(image) : null;
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
}
