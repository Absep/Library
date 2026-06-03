import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function OAuthSuccess() {
  const navigate = useNavigate()

  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search,
      )

    const token =
      params.get('token')

    const role =
      params.get('role')

    const user =
      params.get('user')

    if (token) {
      localStorage.setItem(
        'token',
        token,
      )
    }

    if (user) {
      localStorage.setItem(
        'user',
        decodeURIComponent(user),
      )
    }

    if (role === 'ADMIN') {
      navigate('/dashboard')
    } else {
      navigate('/books')
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex justify-center items-center">
      <h1 className="text-xl font-semibold">
        Signing you in...
      </h1>
    </div>
  )
}

export default OAuthSuccess