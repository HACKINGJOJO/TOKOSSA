import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRoutePath } from '@/app/routes'
import { useAuthStore } from '@/features/auth'
import { authClient } from '@/features/auth/services/authClient'
import { cn } from '@/utils/helpers'

export function Login() {
  const navigate = useNavigate()
  const { login, createPin, isAuthenticated } = useAuthStore()

  const [pin, setPin] = useState(['', '', '', '', '', ''])
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', ''])
  const [isCreatingPin, setIsCreatingPin] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const confirmRefs = useRef<(HTMLInputElement | null)[]>([])

  // Check if first time (no PIN exists)
  useEffect(() => {
    ;(async () => {
      if (!(await authClient.hasPin())) {
        setIsCreatingPin(true)
      }
    })()
  }, [])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(getRoutePath('dashboard'))
    }
  }, [isAuthenticated, navigate])

  const handlePinChange = (index: number, value: string, isConfirm = false) => {
    if (!/^\d*$/.test(value)) return

    const newPin = isConfirm ? [...confirmPin] : [...pin]
    newPin[index] = value.slice(-1)

    if (isConfirm) {
      setConfirmPin(newPin)
    } else {
      setPin(newPin)
    }

    // Move to next input
    if (value && index < 5) {
      const refs = isConfirm ? confirmRefs : inputRefs
      refs.current[index + 1]?.focus()
    }

    // Auto submit when complete
    const currentPin = isConfirm ? newPin : newPin
    if (currentPin.every((d) => d !== '')) {
      if (isCreatingPin) {
        if (isConfirm) {
          handleCreatePin(newPin.join(''))
        } else {
          setIsConfirming(true)
          setTimeout(() => confirmRefs.current[0]?.focus(), 100)
        }
      } else {
        handleLogin(newPin.join(''))
      }
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent,
    isConfirm = false
  ) => {
    const refs = isConfirm ? confirmRefs : inputRefs
    const currentPin = isConfirm ? confirmPin : pin
    const setCurrentPin = isConfirm ? setConfirmPin : setPin

    if (e.key === 'Backspace' && !currentPin[index] && index > 0) {
      refs.current[index - 1]?.focus()
      const newPin = [...currentPin]
      newPin[index - 1] = ''
      setCurrentPin(newPin)
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      refs.current[index - 1]?.focus()
    }

    if (e.key === 'ArrowRight' && index < 5) {
      refs.current[index + 1]?.focus()
    }
  }

  const handleLogin = async (pinCode: string) => {
    setIsLoading(true)
    setMessage(null)

    const result = await login(pinCode)

    if (result.success) {
      setMessage({ type: 'success', text: result.message })
      setTimeout(() => navigate(getRoutePath('dashboard')), 500)
    } else {
      setMessage({ type: 'error', text: result.message })
      setPin(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()

      // Shake animation
      inputRefs.current.forEach((ref) => {
        ref?.classList.add('animate-shake')
        setTimeout(() => ref?.classList.remove('animate-shake'), 500)
      })
    }

    setIsLoading(false)
  }

  const handleCreatePin = async (confirmPinCode: string) => {
    const pinCode = pin.join('')

    if (pinCode !== confirmPinCode) {
      setMessage({ type: 'error', text: 'Les PIN ne correspondent pas' })
      setConfirmPin(['', '', '', '', '', ''])
      confirmRefs.current[0]?.focus()
      return
    }

    setIsLoading(true)
    const result = await createPin(pinCode)

    if (result.success) {
      setMessage({ type: 'success', text: result.message })
      setTimeout(() => navigate(getRoutePath('dashboard')), 500)
    } else {
      setMessage({ type: 'error', text: result.message })
    }

    setIsLoading(false)
  }

  const clearPins = () => {
    setPin(['', '', '', '', '', ''])
    setConfirmPin(['', '', '', '', '', ''])
    setIsConfirming(false)
    inputRefs.current[0]?.focus()
  }

  const PinInputs = ({
    values,
    refs,
    isConfirm = false,
  }: {
    values: string[]
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
    isConfirm?: boolean
  }) => (
    <div className="flex justify-center gap-3">
      {values.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {refs.current[index] = el}}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handlePinChange(index, e.target.value, isConfirm)}
          onKeyDown={(e) => handleKeyDown(index, e, isConfirm)}
          className={cn(
            'w-12 h-14 text-center text-2xl font-bold rounded-xl',
            'bg-gray-100 dark:bg-dark-secondary border-2 border-gray-200 dark:border-gray-700',
            'focus:outline-none focus:border-gold focus:bg-white dark:focus:bg-dark-card',
            'focus:ring-2 focus:ring-gold/30 transition-all',
            digit && 'border-gold bg-gradient-to-br from-gold/10 to-transparent'
          )}
        />
      ))}
    </div>
  )

  // Virtual keypad
  const Keypad = ({ isConfirm = false }: { isConfirm?: boolean }) => {
    const handleKey = (key: string) => {
      const currentPin = isConfirm ? confirmPin : pin
      const setCurrentPin = isConfirm ? setConfirmPin : setPin

      if (key === 'C') {
        clearPins()
        return
      }

      if (key === '⌫') {
        const lastFilledIndex = currentPin.findLastIndex((d) => d !== '')
        if (lastFilledIndex >= 0) {
          const newPin = [...currentPin]
          newPin[lastFilledIndex] = ''
          setCurrentPin(newPin)
          const refs = isConfirm ? confirmRefs : inputRefs
          refs.current[lastFilledIndex]?.focus()
        }
        return
      }

      const firstEmptyIndex = currentPin.findIndex((d) => d === '')
      if (firstEmptyIndex >= 0 && firstEmptyIndex < 6) {
        handlePinChange(firstEmptyIndex, key, isConfirm)
      }
    }

    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫']

    return (
      <div className="grid grid-cols-3 gap-3 max-w-[250px] mx-auto mt-8">
        {keys.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handleKey(key)}
            className={cn(
              'w-16 h-16 rounded-full text-xl font-semibold mx-auto',
              'bg-gray-100 dark:bg-dark-secondary border-2 border-gray-200 dark:border-gray-700',
              'hover:border-gold hover:bg-gold hover:text-white transition-all',
              'active:scale-95'
            )}
          >
            {key}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'min-h-screen flex items-center justify-center p-5',
        'bg-gradient-to-br from-cream to-cream-secondary dark:from-dark dark:to-dark-secondary'
      )}
    >
      <div
        className={cn(
          'w-full max-w-md bg-white dark:bg-dark-card rounded-3xl shadow-2xl',
          'border-2 border-gray-200 dark:border-gray-800 p-10 text-center'
        )}
      >
        {/* Logo */}
        <h1 className="text-3xl font-black font-playfair mb-2">
          <span className="text-gold-dark">JOJO</span>{' '}
          <span className="text-gold">Mastery</span>
        </h1>
        <p className="text-gray-500 mb-8">
          {isCreatingPin
            ? isConfirming
              ? 'Confirme ton PIN'
              : 'Crée ton PIN Admin'
            : 'Entre ton code membre'}
        </p>

        {/* PIN Input */}
        {isCreatingPin && isConfirming ? (
          <PinInputs values={confirmPin} refs={confirmRefs} isConfirm />
        ) : (
          <PinInputs values={pin} refs={inputRefs} />
        )}

        {/* Message */}
        {message && (
          <div
            className={cn(
              'mt-6 p-4 rounded-xl font-semibold',
              message.type === 'error'
                ? 'bg-red-50 text-red-600 dark:bg-red-900/20'
                : 'bg-green-50 text-green-600 dark:bg-green-900/20'
            )}
          >
            {message.text}
          </div>
        )}

        {/* Keypad */}
        <Keypad isConfirm={isCreatingPin && isConfirming} />

        {/* Loading */}
        {isLoading && (
          <div className="mt-6">
            <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        )}

        {/* Help link */}
        {!isCreatingPin && (
          <p className="mt-8 text-sm text-gray-500">
            Code oublié?{' '}
            <span className="text-gold-dark font-semibold">
              Contacte l'admin
            </span>
          </p>
        )}
      </div>
    </div>
  )
}
