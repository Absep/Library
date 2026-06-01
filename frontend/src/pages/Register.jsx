import {
  useState,
} from 'react'

import {
  Link,
  useNavigate,
} from 'react-router-dom'

import api
from '../services/api'

function Register() {
  const navigate =
    useNavigate()

  const [formData,
    setFormData] =
    useState({
      name: '',
      email: '',
      password: '',
    })

  const handleChange =
    (e) => {
      setFormData({
        ...formData,
        [e.target.name]:
          e.target.value,
      })
    }

  const handleSubmit =
    async (e) => {
      e.preventDefault()

      try {
        await api.post(
          '/auth/register',
          formData,
        )

        alert(
          'Registration Successful',
        )

        navigate('/')
      } catch (error) {
        alert(
          error.response?.data
            ?.message ||
          'Registration Failed',
        )
      }
    }

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#F8F7F4]">

      <form
        onSubmit={
          handleSubmit
        }
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >

        <h1 className="text-3xl font-bold text-[#365545] mb-6">
          Register
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full border p-3 rounded mb-4"
          onChange={
            handleChange
          }
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          onChange={
            handleChange
          }
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-4"
          onChange={
            handleChange
          }
        />

        <button
          className="w-full bg-[#4F7C65] text-white p-3 rounded-lg"
        >
          Register
        </button>

        <p className="mt-4 text-center">
          Already have an
          account?

          <Link
            to="/"
            className="text-[#365545] ml-1"
          >
            Login
          </Link>
        </p>

      </form>

    </div>
  )
}

export default Register