import { PublicPost, PublicPostWithComments } from "@/lib/types";
import { SupabaseClient } from "@supabase/supabase-js";

export class PostsService {
  private supabase: SupabaseClient;
  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async createPost(comment: string, image: File | null) {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    const imagePath = image ? await this.uploadImageToBucket(image) : null;
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
    const imageUrl = await this.getPostImageSignedUrl(data.image);
    return { ...data, image: imageUrl, };
  }

  async getPosts() {
    const posts: PublicPost[] = [];
    const { data, error } = await this.supabase.from("post").select("*").order("created_at", { ascending: false });
    if (error) {
      throw new Error(error.message);
    }
    for (const post of data) {
      const imageUrl = await this.getPostImageSignedUrl(post.image);
      posts.push({ ...post, image: imageUrl });
    }
    return posts;
  }

  async uploadImageToBucket(image: File) {
    const { data, error } = await this.supabase.storage.from("prime-images").upload(`${Date.now()}-${image.name}`, image);
    if (error) {
      throw new Error(error.message);
    }
    return data.path;
  }

  private async getPostImageSignedUrl(imageName: string) {
    const { data, error } = await this.supabase.storage.from("prime-images").createSignedUrl(imageName, 600);
    if (error) {
      throw new Error(error.message);
    }
    return data.signedUrl;
  }
}
