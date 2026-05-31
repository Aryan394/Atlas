import { useState } from 'react'
import { register } from '../api/auth'
import { ApiRequestError } from '../api/client'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'

export default function RegisterUserPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    try {
      const user = await register(email, password)
      setSuccess(`Account created for ${user.email}`)
      setEmail('')
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : 'Unable to create account. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg animate-fade-in">
      <Card>
        <h1 className="text-2xl font-semibold text-white">Add user</h1>
        <p className="mt-2 text-sm text-slate-400">
          Create a new account. Requires an authenticated session.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="newuser@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            required
          />
          <Input
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat password"
            required
          />

          {error && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
              {success}
            </p>
          )}

          <Button type="submit" loading={loading}>
            Create account
          </Button>
        </form>
      </Card>
    </div>
  )
}
