import { SupabaseClient } from "@supabase/supabase-js";

export class ImagesService {
  constructor(private supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async uploadImageToBucket(image: File) {
    const { data, error } = await this.supabase.storage
      .from("prime-images")
      .upload(`${Date.now()}-${image.name}`, image);
    if (error) {
      throw new Error(error.message);
    }
    return data.path;
  }

  async getPostImageSignedUrl(imageName: string | null) {
    if (!imageName) return null;
    const { data, error } = await this.supabase.storage
      .from("prime-images")
      .createSignedUrl(imageName, 600);
    if (error) {
      console.error("Error getting signed URL:", error.message);
      return null;
    }
    return data.signedUrl;
  }
}
