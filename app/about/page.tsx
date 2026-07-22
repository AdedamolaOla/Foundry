import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
        About Foundry
      </h1>
      <p className="mt-6 text-neutral-600 dark:text-neutral-400">
        Foundry is a community-driven design resource library. Anyone can
        submit valuable design resources without creating an account. Submissions
        are moderated by our team and published once approved.
      </p>
      <p className="mt-4 text-neutral-600 dark:text-neutral-400">
        You can browse by category, search, and contribute your own links.
        Attribution is optional—share your social profile or submit anonymously.
      </p>
      <p className="mt-6">
        <Link
          href="/"
          className="text-neutral-900 underline hover:no-underline dark:text-white"
        >
          Back to Home
        </Link>
      </p>
    </div>
  );
}
