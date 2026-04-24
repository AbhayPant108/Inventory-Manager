import { getPasswordStrength } from "@/services/auth.service"

/**
 * PasswordStrengthBar
 * ADDED: Renders 4 animated colored segments below the password input.
 */
export function PasswordStrengthBar( {password}:{password:string} ) {
  if (!password) return null
  const { level, label, color } = getPasswordStrength(password)
  return (<>
    <div
      data-testid="password-strength-container"
      className="mt-2 space-y-1.5"
      aria-label={`Password strength: ${label}`}
    >
      {/* 4-segment bar */}
      <div className="flex gap-1.5 h-1.5">
        {[1, 2, 3, 4].map((seg) => (
          <div
            key={seg}
            className={`flex-1 rounded-full transition-all duration-500 ${
              seg <= level ? color : 'bg-zinc-800'
            }`}
          />
        ))}
      </div>
      {/* Strength label */}
      <p className={`text-xs font-medium transition-colors duration-300 ${
        level === 1 ? 'text-red-400' :
        level === 2 ? 'text-amber-400' :
        level === 3 ? 'text-yellow-400' :
        level === 4 ? 'text-emerald-400' : ''
      }`}>
        {label}
      </p>
    </div>
    </>
  )
}