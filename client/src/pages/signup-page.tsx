
/* Action: file_editor create /app/frontend/src/pages/SignupPage.jsx --file-text "/**
 * SignupPage.jsx
 *
 * MODIFIED FROM: LoginPage structure (two-column layout: left hero panel + right form card)
 * ADDED:
 *  - Dark/Premium + Gradient/Modern full-page theme (bg-zinc-950)
 *  - Glassmorphism hero panel with background image, overlay, and feature cards
 *  - Password strength indicator (4-segment animated bar)
 *  - Social login buttons (Google + GitHub) — visual only, no backend wiring
 *  - Terms & conditions checkbox
 *  - Animated form entrance (fade-in + slide-up)
 *  - Gradient CTA submit button (amber → rose)
 *  - All data-testid attributes for testing
 *  - Clean comments throughout
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Package,
  LayoutGrid,
  Replace,
  Box,
} from 'lucide-react'

import { Icon } from '@/components/ui/icon'
import { SignupForm } from '@/forms/signup-form'
import { motion } from 'motion/react'
import { useToast } from '@/hooks/use-toast'
import type { SignupSchema } from '@/schemas/auth'
import { authService } from '@/services/auth.service'

// ─── Constants ───────────────────────────────────────────────────────────────

/** Feature cards shown on the left hero panel (mirrors the original LoginPage cards) */
const FEATURES = [
  {
    icon: LayoutGrid,
    title: 'Catalog control',
    copy: 'Create products, search inventory, and keep category labels consistent.',
  },
  {
    icon: Replace,
    title: 'Stock actions',
    copy: 'Restock, reserve, release, and consume inventory with low-stock visibility.',
  },
  {
    icon: Box,
    title: 'Graceful gaps',
    copy: 'Unsupported backend areas surface clearly instead of failing silently.',
  },
]




/**
 * LeftHeroPanel
 * MODIFIED FROM: LoginPage left Card — replaced with full-bleed dark hero with background image.
 * ADDED: Glassmorphism feature cards with hover animations.
 */
function LeftHeroPanel() {
  // 1. Define the Parent settings
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.7, // 0.5 seconds between each paragraph
      },
    },
  };
  const iconContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 2.8,
      },
    },
  };

  // 2. Define the Child settings
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  const iconVarient = {
    hidden: { scale: 0 },
    visible: { scale: 1 }
  }
  return (
    <div className="relative lg:min-h-screen hidden lg:flex lg:flex-1 flex-col w-full lg:w-[45%] min-h-screen overflow-hidden justify-between p-8">
      {/* Background image from design guidelines */}

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-zinc-950/70 z-0" />
      {/* Bottom-fade gradient for depth */}
      <div className="absolute inset-0  z-0" />

      {/* Brand logo — top left */}
      <div className="relative z-10 flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-linear-to-br from-amber-500 to-rose-600 shadow-lg">
          <Package className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-semibold text-white tracking-tight font-['Outfit']">
          Inventory Manager
        </span>
      </div>

      {/* Hero copy — middle section */}
      <div className="relative z-10 space-y-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {/* MODIFIED: New heading tailored for signup context */}
          <motion.p variants={itemVariants} className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400/80">
            Inventory Management System
          </motion.p>
          <motion.h1 variants={itemVariants} className="text-4xl lg:text-5xl font-['Outfit'] font-semibold tracking-tight leading-tight text-white ">
            Control your catalog.
          </motion.h1>
          <motion.h1 variants={itemVariants} className="text-4xl lg:text-5xl font-['Outfit'] font-semibold tracking-tight leading-tight  max-w-sm bg-linear-to-r from-amber-400 to-rose-500 bg-clip-text text-transparent">
            Predict your gaps.
          </motion.h1>
          <motion.p variants={itemVariants} className="text-base text-zinc-300 max-w-sm leading-relaxed">
            Run products, stock, and store operations from one calm control room.
          </motion.p>
        </motion.div>

        {/* ADDED: Glassmorphism feature cards */}
        <motion.div
          variants={iconContainerVariants}
          initial="hidden"
          animate="visible"
          className="flex gap-4 max-w-md">
          {FEATURES.map(({ icon: Icon, title }, i) => (
            <motion.span
              variants={iconVarient}
              transition={{ delay: 2.8 + i * 0.7 }}
              key={title}
              className="p-2.5 bg-zinc-950/70  rounded-xl inline-flex flex-col justify-center items-center  border border-white/10 text-amber-500">
              <Icon className="h-5 w-5" />
              <span className="font-semibold text-white font-['Outfit'] text-sm mb-1">{title}</span>
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Bottom decorative dot-pattern — ADDED for premium feel */}
      <div
        aria-hidden="true"
        className="relative z-10 items-end-safe text-zinc-600 text-xs"
      >
        © {new Date().getFullYear()} Inventory Manager. All rights reserved.
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * SignupPage
 *
 * MODIFIED FROM: LoginPage — adapted into a full dark signup experience.
 * Kept the same two-panel concept but upgraded both panels significantly.
 */
export function SignupPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSignup(values: SignupSchema) {
    try {
      setIsLoading(true)
      const data = await authService.register({
        ...values,
      })

      toast.success('Account created', data.message)
      navigate('/login')
    } catch (error: any) {
      toast.error('Sign up failed', error?.message)
    } finally { setIsLoading(false) }
  }


  return (
    <>

      <div className="min-h-screen relative inset-0 w-full flex flex-col lg:flex-row text-zinc-50 font-['Manrope'] overflow-hidden">
        <img
          src="signuppng.png"
          alt=""
          aria-hidden="true"
          className="absolute w-full h-full object-fill z-[-1]"
        />
        {/* ── Left: Hero panel ── */}
        <LeftHeroPanel />

        {/* ── Right: Form panel ── */}
        <div className='z-1 flex relative flex-1  justify-center items-center inset-0 bg-zinc-950/70 '>
        <motion.div
          initial={{ y: 200 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring' }}className="flex flex-col  items-end p-8 lg:p-8">
          <div className='bg-zinc-950/70 p-8 rounded-2xl border border-amber-500'>
            {/* Mobile-only brand header */}
            <div className="lg:hidden flex items-center gap-2.5 mb-10 self-start">
              <div className="p-2 rounded-xl bg-linear-to-br from-amber-500 to-rose-600">
                <Package className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-semibold text-white font-['Outfit']">
                Inventory Manager
              </span>
            </div>

            {/*
          ADDED: Animated form container
          Uses Tailwind animate-in (tailwindcss-animate plugin already in package.json)
        */}
            <div
              data-testid="signup-form-container"
              className="w-full max-w-120 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out"
            >
              {/* ── Form header ── */}
              <div className="space-y-2">
                <h2 className="text-3xl font-['Outfit'] font-bold text-white tracking-tight">
                  Create an account
                </h2>
                <p className="text-sm text-zinc-400">
                  Already have one?{' '}
                  {/* MODIFIED FROM: LoginPage's "No account yet?" link — reversed direction */}
                  <Link
                    data-testid="login-link"
                    to="/login"
                    className="font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>

              {/* ── Social login buttons — ADDED (visual only) ── */}
              <div className="grid grid-cols-2 gap-3 mb-2">
                <button
                  type="button"
                  data-testid="social-google-button"

                  aria-label="Sign up with Google"
                >
                  {/* ADDED: Inline SVG Google 'G' — lucide lacks a Google icon */}
                  <Icon
                    className='bg-black border-amber-500'>
                    <img src="google.svg" alt="Company Logo" className="w-10 h-10 p-2" />
                  </Icon>
                </button>

                <button
                  type="button"
                  data-testid="social-github-button"

                  aria-label="Sign up with GitHub"
                >
                  <Icon
                    className='  border-amber-500  '>
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="size-6 text-neutral-900"
                      fill="white"
                    >
                      <path d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.082 3.294 9.392 7.864 10.914.575.106.785-.25.785-.555 0-.273-.01-1.185-.015-2.148-3.199.695-3.873-1.36-3.873-1.36-.523-1.328-1.277-1.682-1.277-1.682-1.044-.714.078-.7.078-.7 1.154.081 1.762 1.185 1.762 1.185 1.026 1.758 2.691 1.25 3.346.956.104-.743.402-1.25.731-1.538-2.554-.29-5.241-1.277-5.241-5.686 0-1.256.448-2.283 1.186-3.087-.119-.29-.514-1.46.113-3.045 0 0 .966-.31 3.164 1.18.919-.255 1.904-.383 2.884-.388.98.005 1.965.133 2.884.388 2.196-1.49 3.16-1.18 3.16-1.18.629 1.585.234 2.755.115 3.045.74.804 1.184 1.831 1.184 3.087 0 4.419-2.691 5.392-5.253 5.678.413.356.782 1.06.782 2.136 0 1.542-.014 2.784-.014 3.162 0 .308.206.666.79.552C20.709 21.637 24 17.329 24 12.25 24 5.896 18.854.75 12.5.75Z"></path>
                    </svg>
                  </Icon>

                </button>
              </div>

              {/* ── Divider — ADDED ── */}
              <div className="relative flex items-center">
                <div className="grow border-t border-zinc-800" />
                <span className="shrink-0 mx-4 text-zinc-500 text-sm">or continue with</span>
                <div className="grow border-t border-zinc-800" />
              </div>

              {/* ── Signup form ── */}
              <SignupForm onSubmit={handleSignup} isLoading={isLoading} />

              {/* ── Footer note ── */}
              <p className="text-center text-xs text-zinc-600 pt-2">
                By signing up you acknowledge that you have read and understood our usage policies.
              </p>
            </div>
          </div>
      </motion.div>
      </div>
    </div >
    </>
  )
}




