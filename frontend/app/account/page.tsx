'use client'

import { useEffect, useState } from 'react'
import MovieCard from '@/components/MovieCard'
import BookmarkCard from '@/components/BookmarkCard'


// provide type for the movie object
type Movie = {
  id: number
  title: string
  release_date: string
  poster_path: string
}

const GENRES = [
  "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime",
  "Documentary", "Drama", "Fantasy", "History", "Horror", "Musical",
  "Mystery", "Romance", "Sci-Fi", "Sport", "Thriller", "War", "Western"
]

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

export default function AccountPage() {
  const [userId, setUserId] = useState<number | null>(null)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [activeTab, setActiveTab] = useState('account')
  const [bookmarks, setBookmarks] = useState<Movie[]>([])
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const id = localStorage.getItem('user_id')
    if (id) {
      setUserId(parseInt(id))

      // fetch user data from the backend scripts
      fetch(`${BASE_URL}/getUser.php?id=${id}`)
        .then(res => res.json())
        .then(data => {
          setEmail(data.email || '')
          setUsername(data.name || '')
        })
      
      // fetch bookmarks from the backend scripts
      fetch(`${BASE_URL}/getBookmarks.php?user_id=${id}`)
        .then(res => res.json())
        .then(data => setBookmarks(data))

      // fetch genre preferences from the backend scripts
      fetch(`${BASE_URL}/getPreference.php?user_id=${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.genre_preference) {
            setSelectedGenres(data.genre_preference.split(',').map((s: string) => s.trim()))
          }
        })
    }
  }, [])

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    )
  }

  // save genre preferences to the backend scripts
  const handleGenreSave = async () => {
    if (!userId) return
    const genre_preference = selectedGenres.join(',')


    const res = await fetch(`${BASE_URL}/updatePreference.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, genre_preference })
    })

    const data = await res.json()
    setMessage(data.success ? 'Preferences updated!' : 'Failed to update preferences.')
  }

  // new password and confirmed new password not matching
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || password !== confirmPassword) {
      setMessage("Passwords do not match.")
      return
    }

    // send password details for changing
    const res = await fetch(`${BASE_URL}/changePassword.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, current_password: currentPassword, new_password: password })
    })

    const data = await res.json()
    setMessage(data.success ? 'Password updated!' : 'Failed to update password.')
  }

  const handleLogout = () => {
    localStorage.removeItem('user_id')
    window.location.href = '/'
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 text-white">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full flex flex-col gap-4 md:w-1/4 border-r border-white pr-4 space-y-4">
          {[
            { label: "Account", key: "account" },
            { label: "Bookmarks", key: "bookmarks" },
            { label: "Genre Preference", key: "preferences" },
            { label: "Security", key: "security" },
          ].map(tab => (
            // chekcs if the tab is selected and applies styles accordingly
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-4/5 text-left pb-1 border-b-2 transition duration-300 ${
                activeTab === tab.key
                  ? "text-white border-white"
                  : "text-gray-400 border-transparent hover:text-fuchsia-400"
              }`}
            >
              {tab.label}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="w-full text-left text-red-500 hover:text-red-400 hover:underline transition duration-300"
          >
            Logout
          </button>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-3/4">
          {activeTab === 'account' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Account Info</h2>
              <p><span className="font-semibold">Email:</span> {email}</p>
              <p><span className="font-semibold">Username:</span> {username}</p>
            </div>
          )}

          {/* switches between tabs depending on which is selected */}
          {activeTab === 'bookmarks' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Your Bookmarked Movies</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {bookmarks.map(movie => (
                  <BookmarkCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  release_date={movie.release_date}
                  onRemove={(id) =>
                    setBookmarks((prev) => prev.filter((movie) => movie.id !== id))
                  }
                />
                
                ))}
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Your Genre Preferences</h2>
              <p className="mb-4">Selected: {selectedGenres.join(', ') || 'None'}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                {GENRES.map((genre, idx) => (
                  <label key={idx} className="flex items-center gap-2 cursor-pointer text-white">
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre)}
                      onChange={() => toggleGenre(genre)}
                      className="appearance-none w-5 h-5 border-1 border-white rounded-full checked:bg-gradient-to-r checked:from-fuchsia-600 checked:to-violet-900 transition duration-300"
                    />
                    <span>{genre}</span>
                  </label>
                ))}
              </div>
              <button onClick={handleGenreSave} className="w-1/3 mt-4 border border-white rounded-lg hover:bg-gradient-to-r hover:from-fuchsia-600 hover:to-violet-900 text-white py-2 transition duration-300 ease-in-out shadow-sm shadow-white">Save Preferences</button>
              {message && <p className="mt-4 text-sm text-white">{message}</p>}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="flex justify-center">
              <form
                onSubmit={handlePasswordChange}
                className="flex flex-col items-center w-full max-w-md gap-1 p-6 bg-transparent border rounded-xl border-white shadow-md shadow-white"
              >
                <h2 className="text-2xl font-bold mb-6 text-white">Change Password</h2>
                <input
                  type="password"
                  placeholder="Current Password"
                  className="w-full mb-3 p-2 border rounded-lg bg-transparent text-white shadow-sm shadow-white"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full mb-3 p-2 border rounded-lg bg-transparent text-white shadow-sm shadow-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full mb-3 p-2 border rounded-lg bg-transparent text-white shadow-sm shadow-white"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-1/2 mt-4 border border-white rounded-lg hover:bg-gradient-to-r hover:from-fuchsia-600 hover:to-violet-900 text-white py-2 transition duration-300 ease-in-out shadow-sm shadow-white"
                >
                  Update
                </button>
                {message && <p className="mt-4 text-white text-sm">{message}</p>}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
