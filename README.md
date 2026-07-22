# Foundry

Community-driven design resource library. Submit resources without an account; admins moderate before publishing.

## Stack

- **Next.js** (App Router), **TypeScript**, **Tailwind CSS**
- **Supabase**: Auth, Database, Edge Functions

## Setup

1. **Clone and install**

   ```bash
   npm install
   ```

2. **Supabase project**

   - Create a project at [supabase.com](https://supabase.com).
   - In **SQL Editor**, run the migration:
     - Copy contents of `supabase/migrations/20250219000000_create_contributions.sql` and run it.
   - Add an admin user (after signing up a user in your app or via Supabase Auth):
     - Get the user's UUID from Authentication → Users.
     - Run: `INSERT INTO public.admin_users (user_id) VALUES ('<user-uuid>');`
   - Optional: set **Environment variables** for Edge Functions (they get `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` automatically in production).

3. **Environment variables**

   Copy `.env.example` to `.env.local` and set:

   - `NEXT_PUBLIC_SUPABASE_URL` – project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` – anon/public key
   - `ADMIN_EMAILS` (optional) – comma-separated emails that can access `/admin` without being in `admin_users`
   - `SUPABASE_SERVICE_ROLE_KEY` (optional, server-only) – for admin checks if needed

4. **Deploy Edge Functions** (Supabase CLI)

   ```bash
   npx supabase link --project-ref <your-ref>
   npx supabase functions deploy submit_contribution
   npx supabase functions deploy generate_link_preview
   npx supabase functions deploy admin_review_contribution
   ```

5. **Run the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Use **Contribute** to submit; sign in and open **Admin** to approve/reject/edit.

## Routes

- `/` – Home (browse approved resources, search, categories)
- `/about` – About
- `/admin` – Moderation dashboard (admin only)
- `/admin/login` – Admin sign in

## Database

- **contributions** – submissions; RLS ensures only `status = 'approved'` are visible publicly; anyone can INSERT.
- **admin_users** – list of user IDs allowed to access admin and Edge Function `admin_review_contribution`.

## Edge Functions

- **submit_contribution** – validates and inserts a contribution with `status = 'pending'`.
- **generate_link_preview** – accepts a URL, returns an `og:image` or `twitter:image` URL (optional use).
- **admin_review_contribution** – requires auth + admin; actions: `approve`, `reject`, `edit`.
