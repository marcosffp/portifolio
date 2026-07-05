import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'
import { Lock, KeyRound, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { useTranslation } from '../contexts/LanguageContext'
import LanguageToggle from '../components/LanguageToggle'

// PÁGINA: Redefinir Senha (/reset-password)
//
// Pra esse fluxo funcionar de ponta a ponta, falta configurar no painel do Supabase:
// Authentication > URL Configuration > Redirect URLs — adicionar a URL desta página
// (ex: https://seudominio.com/reset-password) na lista de redirects permitidos.
// Sem isso, o link do e-mail de "esqueci minha senha" não vai trazer a sessão de
// recuperação e esta tela vai cair direto no estado de "link inválido".
export default function ResetPassword() {
  const { t } = useTranslation()
  const tr = t.resetPassword
  const navigate = useNavigate()

  const [sessionReady, setSessionReady] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) {
        setSessionReady(true)
        setCheckingSession(false)
      }
    })

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSessionReady(true)
      setCheckingSession(false)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError(tr.tooShort)
      return
    }
    if (password !== confirmPassword) {
      setError(tr.mismatch)
      return
    }

    setLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setSuccess(true)
    setTimeout(() => navigate('/login'), 2500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <LanguageToggle floating />
      <div className="w-full max-w-md">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-700" />
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/15 rounded-2xl p-8 space-y-7">

            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/25">
                <KeyRound className="w-3.5 h-3.5 text-primary" />
                <span className="text-secondary text-xs font-medium">{tr.pageName}</span>
              </div>
              <h1 className="text-3xl font-bold text-white">{tr.pageName}</h1>
              <p className="text-gray-400 text-sm">{tr.subtitle}</p>
            </div>

            {checkingSession ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            ) : success ? (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                <p className="text-gray-200 text-sm">{tr.success}</p>
              </div>
            ) : !sessionReady ? (
              <div className="space-y-4 text-center">
                <p className="text-red-400 text-sm">{tr.invalidLink}</p>
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm text-gray-400 hover:text-white transition-colors underline"
                >
                  {tr.backToLogin}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">{tr.newPassword}</label>
                  <div className="flex items-center bg-white/8 border border-white/15 rounded-xl overflow-hidden focus-within:border-primary/60 transition-colors">
                    <Lock className="w-4 h-4 text-gray-500 ml-4 shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="w-full bg-transparent px-3 py-3 text-gray-100 placeholder-gray-500 text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="mr-4 shrink-0 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">{tr.confirmPassword}</label>
                  <div className="flex items-center bg-white/8 border border-white/15 rounded-xl overflow-hidden focus-within:border-indigo-500/60 transition-colors">
                    <Lock className="w-4 h-4 text-gray-500 ml-4 shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                      className="w-full bg-transparent px-3 py-3 text-gray-100 placeholder-gray-500 text-sm outline-none"
                    />
                  </div>
                </div>

                {error && <p className="text-red-400 text-xs">{error}</p>}

                <button type="submit" disabled={loading} className="relative group/btn w-full mt-1">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-dark to-secondary-dark rounded-xl opacity-70 blur group-hover/btn:opacity-100 transition duration-300" />
                  <div className="relative h-11 bg-canvas rounded-xl border border-white/10 flex items-center justify-center gap-2 overflow-hidden">
                    <div className="absolute inset-0 scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-primary-dark/20 to-secondary-dark/20" />
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span className="relative text-sm font-medium text-white">{tr.submit}</span>
                    )}
                  </div>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
