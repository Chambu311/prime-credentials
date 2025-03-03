# Prime Credentials - Social Media Platform

A modern social media platform built with Next.js 15, featuring real-time post creation, commenting, and image sharing capabilities.

## Overview

This project implements a social media platform with the following key features:

- User authentication via GitHub OAuth
- Post creation with text and image support
- Comment system with image attachments
- Image upload and storage using Supabase
- Optimized image loading and preview

# Architecture

This project is built using Next.js 15, Supabase, and Tailwind CSS.
There are 2 routes:

- `/` - Home page
- `/post/:id` - Post page
  The home page displays all posts in reverse chronological order.
  The post page displays a single post and all associated comments.
  On order to comment or post, the user needs to be authenticated via GitHub OAuth.
  My idea was to do the assignment without installing external libraries, so the functionality of the site is purily React and Next and their native libraries, along with Supabase
  React hooks are used for the client side logic, and Next server actions for the client to interact with the server.
  For the backend, i divided the data into two layers:
- The controller, which serves as the api gateway, and is responsible for validating the data and calling the appropriate service layer methods.
- The service layer, which contains the logic for each data type, and is responsible for interacting with the database.

Both routes are server components, the each section that requires interactivity is a client component such as the add comment and add post sections.

# Solution

The solution is pretty simple, the user can create a post with a text and an image.
The user can also comment on a post, and the comment can have an image.
The posts and comments are stored in a database, and the images are stored in a storage bucket.
A comment is associated with a post, and a post can have multiple comments.
Both comments and posts have a user associated via the user_id, but the user_email is not a foreign key, it was added just to show who created the post or comment.
The images are stored in a Supabase bucket, and the signed url is generated each time a request is made to display the image.
Supabase provides both a server and client client to handle the authentication and database queries.
For the server you can check whether there is a user logged in any file that runs on the server.
For the client, i created a context so that each component can have access to the user data, without the need for prop drilling.

## Local Development Setup

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- GitHub account for OAuth
- Supabase account

### Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd prime-credentials
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up Supabase:

   - Create a new Supabase project
   - Create the following tables:
     - `post` (id, content, image, user_id, user_email, created_at)
     - `comment` (id, content, image, post_id, user_id, user_email, created_at)
   - Set up storage bucket named "prime-images"
   - Configure GitHub OAuth in Supabase dashboard

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Database Schema

```sql
-- Posts table
create table post (
  id uuid default uuid_generate_v4() primary key,
  content text,
  image text,
  user_id uuid references auth.users(id),
  user_email text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Comments table
create table comment (
  id uuid default uuid_generate_v4() primary key,
  content text,
  image text,
  post_id uuid references post(id) on delete cascade,
  user_id uuid references auth.users(id),
  user_email text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```
