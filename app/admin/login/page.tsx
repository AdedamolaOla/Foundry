import { AdminLoginForm } from "@/components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
          Admin sign in
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Sign in with your admin account to moderate contributions.
        </p>
        <AdminLoginForm className="mt-6" />
      </div>
    </div>
  );
}
