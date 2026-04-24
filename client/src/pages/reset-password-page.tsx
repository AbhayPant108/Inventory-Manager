
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
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
    Package,
    LayoutGrid,
    Replace,
    Box,
} from 'lucide-react'

import { motion } from 'motion/react'
import { useToast } from '@/hooks/use-toast'
import type { ResetPasswordSchema } from '@/schemas/auth'
import { authService } from '@/services/auth.service'
import type { ClassValue } from 'clsx'
import { Toaster } from '@/components/ui/toaster'
import { ResetPasswordForm } from '@/forms/reset-password-form'
import { NotFoundPage } from './not-found-page'

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
function LeftHeroPanel({ className }: { className?: ClassValue }) {
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
        <div className={`relative lg:min-h-screen hidden lg:flex flex-col w-full lg:w-[45%] min-h-screen overflow-hidden justify-between p-8 ${className}`}>
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
                            className="p-2.5 rounded-xl inline-flex flex-col justify-center items-center bg-white/5 border border-white/10 text-amber-500">
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
export function ResetPasswordPage() {
    const navigate = useNavigate()
    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [searchParams] = useSearchParams()
    const uid = searchParams.get('uid')
    const token = searchParams.get('token')
    if (!uid || !token) return <NotFoundPage />


    async function handleResetPassword(values: ResetPasswordSchema) {
        try {
            setIsLoading(true)
            if (!uid || !token) throw Error('')
            const { confirmPassword, ...resetPassword } = values
            const data = {
                uid,
                token,
                ...resetPassword
            }
            await authService.resetPassword(data)
            toast.success('Password reset successful.')
            navigate('/login')
        } catch (error: any) {
            toast.error('Password reset failed.', error?.message)
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <>
            <img
                src="signuppng.png"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-fit z-0"
            />
    // ADDED: Full-page dark background — no wrapping Card, unlike the original LoginPage
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-zinc-950/50 to-zinc-950 z-1 min-h-screen w-full flex flex-col lg:flex-row  text-zinc-50 font-['Manrope'] overflow-hidden">

                {/* ── Left: Hero panel ── */}
                <LeftHeroPanel className='' />

                {/* ── Right: Form panel ── */}
                <div className='z-1 flex relative flex-1  justify-center items-center inset-0 bg-zinc-950/70 '>
                    <motion.div
                        initial={{ y: 200 }}
                        animate={{ y: 0 }}
                        transition={{ type: 'spring' }} className="flex flex-col  items-end p-8 lg:p-8">
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
                            className="px-10 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out"
                        >
                            {/* ── Form header ── */}
                            <div className="space-y-2">
                                <h2 className="text-3xl font-['Outfit'] font-bold text-white tracking-tight">
                                    Reset Password
                                </h2>
                            </div>



                            {/* ── Signup form ── */}
                            <ResetPasswordForm onSubmit={handleResetPassword} isLoading={isLoading} />

                    </div>
                </motion.div>
            </div>
        </div>
        <Toaster />
    </>
  )
}





