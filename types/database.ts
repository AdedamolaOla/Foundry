export type AttributionType =
  | "anonymous"
  | "x"
  | "instagram"
  | "linkedin"
  | "github";

export type ContributionStatus = "pending" | "approved" | "rejected";

export interface Contribution {
  id: string;
  title: string;
  link: string;
  description: string | null;
  category: string;
  attribution_type: AttributionType;
  attribution_value: string | null;
  preview_image_url: string | null;
  status: ContributionStatus;
  created_at: string;
}

export interface ContributionInsert {
  title: string;
  link: string;
  description?: string | null;
  category: string;
  attribution_type: AttributionType;
  attribution_value?: string | null;
  preview_image_url?: string | null;
  status?: ContributionStatus;
}
