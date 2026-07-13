'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AiFillHome, AiOutlineSearch, AiOutlineUser, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'
import { MdLogout } from 'react-icons/md'
import { GoHome } from 'react-icons/go'

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // stores user login in localStorage
  useEffect(() => {
    const userId = localStorage.getItem('user_id')
    setIsLoggedIn(!!userId)
  }, [])

  // handles user logout
  const handleLogout = () => {
    localStorage.removeItem('user_id')
    setIsLoggedIn(false)
    window.location.href = '/'
  }

  return (
    <header className="bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-md p-4 mb-6 py-8 shadow-2xl shadow-indigo-950 border-b border-white/10">
      <div className="max-w-[100rem] mx-auto flex justify-between items-center px-4">

        <Link href="/" className="flex items-center gap-1 text-white">
          <h1 className="text-2xl font-bold text-white hover:text-transparent bg-clip-text hover:bg-gradient-to-r hover:from-green-600 hover:to-cyan-600 transition duration-300">
            CINESCOPE
          </h1>
        </Link>

        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white"
          >
            {menuOpen ? <AiOutlineClose size={26} /> : <AiOutlineMenu size={26} />}
          </button>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="flex items-center gap-1 text-white">
            <GoHome size={25} />
          </Link>

          <Link href="/search" className="flex items-center gap-1 text-white hover:underline">
            <AiOutlineSearch size={24} />
          </Link>

          {!isLoggedIn ? (
            <Link href="/signup" className="flex items-center gap-1 text-white hover:underline">
              <AiOutlineUser size={24} />
            </Link>
          ) : (
            <>
              <Link href="/account" className="text-white hover:underline">
                <AiOutlineUser size={24} />
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-500 hover:underline"
              >
                <MdLogout size={26} />
              </button>
            </>
          )}
        </nav>
      </div>

      {/* mobile menu open */}
      {menuOpen && (
        <div className="md:hidden mt-4 px-4 space-y-4">
          <Link href="/" onClick={() => setMenuOpen(false)} className="block text-white">
            <GoHome className="inline-block mr-2" /> Home
          </Link>
          <Link href="/search" onClick={() => setMenuOpen(false)} className="block text-white">
            <AiOutlineSearch className="inline-block mr-2" /> Search
          </Link>
          {!isLoggedIn ? (
            <Link href="/signup" onClick={() => setMenuOpen(false)} className="block text-white">
              <AiOutlineUser className="inline-block mr-2" /> Sign Up
            </Link>
          ) : (
            <>
              <Link href="/account" onClick={() => setMenuOpen(false)} className="block text-white">
                <AiOutlineUser className="inline-block mr-2" /> Account
              </Link>
              <button
                onClick={handleLogout}
                className="block text-red-500"
              >
                <MdLogout className="inline-block mr-2" /> Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
