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

  public async getPostImageSignedUrl(imageName: string) {
    const { data, error } = await this.supabase.storage
      .from("prime-images")
      .createSignedUrl(imageName, 600);
    if (error) {
      throw new Error(error.message);
    }
    return data.signedUrl;
  }
}
