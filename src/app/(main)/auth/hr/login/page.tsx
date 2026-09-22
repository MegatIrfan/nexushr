"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Eye, EyeOff, Sparkles, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useHrAuth } from "@/stores/hr/auth-store";

const roleLabelMap: Record<string, string> = {
  admin: "HR Administrator",
  ketua: "Team Supervisor",
  staf: "Staff Employee",
};

export default function HrLoginPage() {
  const router = useRouter();
  const login = useHrAuth((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 450));

    const success = login(email, password);
    if (success) {
      toast.success("Successfully authenticated!");
      router.push("/dashboard/hr");
    } else {
      toast.error("Invalid email address or password.");
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    toast.info("Google SSO (Demo): Signing in as HR Administrator...");
    setTimeout(() => {
      login("admin@company.com", "admin123");
      toast.success("Successfully authenticated with Google SSO!");
      router.push("/dashboard/hr");
      setIsLoading(false);
    }, 600);
  };

  const quickLogin = (role: "admin" | "ketua" | "staf") => {
    const creds = {
      admin: { email: "admin@company.com", password: "admin123" },
      ketua: { email: "penyelia@company.com", password: "penyelia123" },
      staf: { email: "staf@company.com", password: "staf123" },
    };
    setEmail(creds[role].email);
    setPassword(creds[role].password);
    toast.info(`Loaded credentials for ${roleLabelMap[role] ?? "Staff"}.`);
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* ─── Left Side: Modern Dark Hero with Glowing Blue Waves ─────────── */}
      <div className="relative hidden w-full flex-col justify-between overflow-hidden bg-[#030611] p-10 text-white lg:flex lg:w-1/2 xl:p-14">
        {/* Background Image Layer */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <Image
            src="/images/login-hero.jpg"
            alt="Abstract glowing waves"
            fill
            priority
            className="object-cover object-center opacity-65"
          />
          {/* Radial & Linear gradient overlays for deep cinematic contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#030611] via-[#030611]/40 to-[#030611]/80" />
          <div className="absolute inset-0 bg-radial-[at_bottom_left] from-blue-600/20 via-transparent to-transparent" />
        </div>

        {/* Big subtle watermark text */}
        <div className="pointer-events-none absolute bottom-12 -left-8 z-0 select-none font-extrabold text-[120px] text-blue-900/10 tracking-tighter xl:text-[160px]">
          nexushr
        </div>

        {/* Top Header / Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 ring-1 ring-white/20">
              <Users className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-white">NexusHR</span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-blue-400">Workforce Cloud</span>
            </div>
          </div>
        </div>

        {/* Main Center Hero Headline & Subtitle */}
        <div className="relative z-10 my-auto max-w-xl space-y-6 pt-12 pb-16">
          <h1 className="font-bold text-3xl leading-tight tracking-tight text-white sm:text-4xl xl:text-5xl">
            The intelligent platform to empower, manage, and scale your global workforce.
          </h1>
          <p className="max-w-md font-normal text-base text-zinc-400 sm:text-lg">
            The trusted human capital management platform for modern enterprises and agile organizations.
          </p>
        </div>

        {/* Bottom Footer Copyright */}
        <div className="relative z-10 text-xs text-zinc-400">Copyright © 2026 NexusHR Inc. All rights reserved</div>
      </div>

      {/* ─── Right Side: Clean Minimalist Sign-in Canvas ───────────────────── */}
      <div className="flex w-full flex-1 flex-col justify-between bg-zinc-50 p-6 sm:p-12 lg:w-1/2 lg:p-14 dark:bg-zinc-950">
        {/* Mobile-only brand badge */}
        <div className="flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <Users className="h-4 w-4" />
            </div>
            <span className="font-bold text-xl text-zinc-900 tracking-tight dark:text-zinc-50">NexusHR</span>
          </div>
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-medium text-blue-600 text-xs dark:bg-blue-950/40 dark:text-blue-400">
            Enterprise Cloud
          </span>
        </div>

        {/* Centered Login Card */}
        <div className="mx-auto my-auto w-full max-w-sm space-y-6 pt-6 sm:max-w-md">
          <div className="space-y-1.5 text-center">
            <h2 className="font-bold text-2xl text-zinc-900 tracking-tight sm:text-3xl dark:text-zinc-50">
              Welcome back!
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Sign in to your account to continue</p>
          </div>

          {/* Continue with Google Button */}
          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-zinc-200/80 bg-white px-4 font-medium text-sm text-zinc-700 shadow-2xs transition-all hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {/* Official Google G SVG icon */}
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-label="Google logo">
                <title>Google logo</title>
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Divider with faint line and "or" */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="w-full border-zinc-200 border-t dark:border-zinc-800" />
            <span className="absolute bg-zinc-50 px-3 text-xs text-zinc-400 dark:bg-zinc-950">or</span>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="hr-email" className="font-medium text-xs text-zinc-700 dark:text-zinc-300">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="hr-email"
                  type="email"
                  placeholder="your.name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-xl border-zinc-200 bg-white px-3.5 text-sm shadow-2xs placeholder:text-zinc-400 focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-900"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="hr-password" className="font-medium text-xs text-zinc-700 dark:text-zinc-300">
                  Password
                </Label>
                <Link href="#" className="text-blue-600 text-xs hover:underline dark:text-blue-400">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="hr-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl border-zinc-200 bg-white pr-10 pl-3.5 text-sm shadow-2xs placeholder:text-zinc-400 focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Vibrant Royal Blue Sign In Button */}
            <Button
              id="hr-login-btn"
              type="submit"
              disabled={isLoading}
              className="h-11 w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 font-semibold text-sm text-white shadow-blue-500/25 shadow-md transition-all hover:from-blue-700 hover:to-blue-600 hover:shadow-blue-500/35"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Sign up prompt footer link */}
          <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toast.info("Account registration is managed by your organization's HR Administrator.");
              }}
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Contact Administrator
            </Link>
          </p>

          {/* Quick Demo Login Pills for Testing on Vercel */}
          <div className="mt-6 rounded-2xl border border-zinc-200/80 bg-white/70 p-3.5 text-center shadow-2xs backdrop-blur-xs dark:border-zinc-800/80 dark:bg-zinc-900/60">
            <div className="flex items-center justify-center gap-1.5 font-medium text-[11px] text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span>One-Click Role Demonstration</span>
            </div>
            <div className="mt-2.5 grid grid-cols-3 gap-1.5">
              <button
                type="button"
                id="quick-login-admin"
                onClick={() => quickLogin("admin")}
                className="rounded-lg border border-zinc-200/70 bg-zinc-50/60 p-2 text-center transition-all hover:border-blue-400 hover:bg-blue-50/50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700"
              >
                <div className="font-semibold text-blue-600 text-xs dark:text-blue-400">HR Admin</div>
                <div className="truncate text-[10px] text-zinc-400">admin@company</div>
              </button>
              <button
                type="button"
                id="quick-login-ketua"
                onClick={() => quickLogin("ketua")}
                className="rounded-lg border border-zinc-200/70 bg-zinc-50/60 p-2 text-center transition-all hover:border-amber-400 hover:bg-amber-50/50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-700"
              >
                <div className="font-semibold text-amber-600 text-xs dark:text-amber-400">Supervisor</div>
                <div className="truncate text-[10px] text-zinc-400">penyelia@company</div>
              </button>
              <button
                type="button"
                id="quick-login-staf"
                onClick={() => quickLogin("staf")}
                className="rounded-lg border border-zinc-200/70 bg-zinc-50/60 p-2 text-center transition-all hover:border-emerald-400 hover:bg-emerald-50/50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700"
              >
                <div className="font-semibold text-emerald-600 text-xs dark:text-emerald-400">Employee</div>
                <div className="truncate text-[10px] text-zinc-400">staf@company</div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom subtle copyright / branding for small screens */}
        <div className="pt-6 text-center text-[11px] text-zinc-400 lg:hidden">
          Copyright © 2026 NexusHR Inc. All rights reserved
        </div>
      </div>
    </div>
  );
}
