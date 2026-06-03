import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {  Link,} from 'react-router-dom'
import api from '../services/api'

function Login() {
  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const navigate =
    useNavigate()

  const handleLogin = async (
    e,
  ) => {
    e.preventDefault()

    try {
      const response =
        await api.post(
          '/auth/login',
          {
            email,
            password,
          },
        )

      localStorage.setItem(
        'token',
        response.data
          .access_token,
      )

      localStorage.setItem(
        'user',
        JSON.stringify(
          response.data.user,
        ),
      )

      const user =
        response.data.user

      if (
        user.role === 'ADMIN'
      ) {
        navigate(
          '/dashboard',
        )
      } else {
        navigate('/books')
      }

    } catch (error) {
      alert(
        'Invalid credentials',
      )
    }
  }

  const handleGoogleLogin = () => {
    window.location.href =
      'http://localhost:3000/auth/google';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4]">

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          Library Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value,
            )
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-4"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value,
            )
          }
          required
        />

        <button
          type="submit"
          className="w-full bg-[#4F7C65]
hover:bg-[#365545] hover:bg-blue-600 text-white p-3 rounded transition"
        >
          Login
        </button>
        
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full mt-3 border border-gray-300 p-3 rounded bg-white hover:bg-gray-100"
        >
          Continue with Google
        </button>

        <p className="mt-4 text-center">
          Don't have an account?

          <Link
            to="/register"
            className="text-[#365545] font-semibold ml-1"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login