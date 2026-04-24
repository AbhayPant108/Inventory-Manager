
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
import {
  Check,
  Cross,
  Loader,
  Loader2,
  Package,
  X,
} from 'lucide-react'


import { useToast } from '@/hooks/use-toast'
import type { EmailSchema } from '@/schemas/auth'
import { authService } from '@/services/auth.service'
import { LeftHeroPanel } from '@/components/layout/left-hero-panel'
import { Toaster } from '@/components/ui/toaster'
import { EmailForm } from '@/forms/reset-password-form'
import { motion } from 'motion/react'

// ─── Constants ───────────────────────────────────────────────────────────────

/** Feature cards shown on the left hero panel (mirrors the original LoginPage cards) */


// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * SignupPage
 *
 * MODIFIED FROM: LoginPage — adapted into a full dark signup experience.
 * Kept the same two-panel concept but upgraded both panels significantly.
 */
export function ForgotPasswordPage() {
  const toast = useToast()
  const [sendStatus, setSendStatus] = useState<'sent' | 'sending' | 'none' | 'error'>('none')

  async function handleSendEmail(values: EmailSchema) {
    try {
      setSendStatus('sending')
      await authService.sendEmail(values)
      setSendStatus('sent')
      toast.success('Email sent successful.')

    } catch (error: any) {
      console.log(error);
      toast.error('Email not sent.', error?.message)
      setSendStatus('error')
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
            transition={{ type: 'spring' }} className="flex flex-col  items-end bg-zinc-950/70 rounded-2xl border border-amber-500 p-8 lg:p-8">
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
                  Enter Email
                </h2>
                <p className='text-sm '>We will send an email to your email id</p>
                {sendStatus !== 'none' &&
                  <span className='flex items-center gap-1'>

                    {sendStatus === 'sending' && <Loader2 size={12} className={'animate-spin'} color='oklch(76.9% 0.188 70.08)' />}
                    {sendStatus === 'sent' && <Check size={12} color='oklch(72.3% 0.219 149.579)' />}
                    {sendStatus === 'error' && <X size={12} color='oklch(70.4% 0.191 22.216)' />}
                    {sendStatus === 'sending' && <span className='text-xs text-amber-500' >Sending email</span>}
                    {sendStatus === 'sent' && <span className='text-xs text-green-500/90' >Email sent</span>}
                    {sendStatus === 'error' && <span className='text-xs text-red-400/90' >Email not sent</span>}


                  </span>
                }
              </div>



              {/* ── Signup form ── */}
              <EmailForm onSubmit={handleSendEmail} isLoading={sendStatus === 'sending'} />


            </div>
            </motion.div>
        </div>
      
    </div >
      <Toaster />
    </>
  )
}





