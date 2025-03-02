

export type Post = {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    image: string;
    user_email: string;
}


export type Comment = {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    post_id: string;
    image: string;
    user_email: string;
}

export type PublicPost = Omit<Post, "user_id">;
export type PublicComment = Omit<Comment, "user_id">;

export type PublicPostWithComments = PublicPost & {
    comment: PublicComment[];
}