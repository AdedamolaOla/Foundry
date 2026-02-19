-- Contributions table (per PRD)
CREATE TABLE IF NOT EXISTS public.contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  link text NOT NULL,
  description text,
  category text NOT NULL,
  attribution_type text NOT NULL CHECK (attribution_type IN ('anonymous', 'x', 'instagram', 'linkedin', 'github')),
  attribution_value text,
  preview_image_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for public listing (approved only)
CREATE INDEX IF NOT EXISTS idx_contributions_status ON public.contributions (status);
CREATE INDEX IF NOT EXISTS idx_contributions_category ON public.contributions (category);
CREATE INDEX IF NOT EXISTS idx_contributions_created_at ON public.contributions (created_at DESC);

-- RLS
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

-- Public: anyone can INSERT (submit)
CREATE POLICY "Public can insert contributions"
  ON public.contributions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Public: only approved rows visible to anon
CREATE POLICY "Public can select approved only"
  ON public.contributions FOR SELECT
  TO anon
  USING (status = 'approved');

-- Admin: authenticated users in admin_users can do everything (we use a small table to allowlist admins)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Only service role or backend should insert into admin_users; RLS can restrict reads
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read admin_users"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM public.admin_users)
  );

-- Admins get full access to contributions
CREATE POLICY "Admins can select all contributions"
  ON public.contributions FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM public.admin_users)
  );

CREATE POLICY "Admins can update contributions"
  ON public.contributions FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM public.admin_users)
  )
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM public.admin_users)
  );

-- Admins cannot delete (V1); anon cannot update/delete
-- No DELETE policy: no one can delete via RLS in V1

COMMENT ON TABLE public.contributions IS 'Community-submitted design resources; only approved rows are public.';
