'use client'

import { useEffect, useState } from 'react'

type Movie = {
  id: number
  title: string
  genre: string
  release_date: string
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

export default function WatchlistPage() {
  const [bookmarks, setBookmarks] = useState<Movie[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const id = localStorage.getItem('user_id')
    setUserId(id)

    // Fetch bookmarked movies from the backend scripts
    if (id) {
      fetch(`${BASE_URL}/getBookmarks.php?user_id=${id}`)
        .then(res => res.json())
        .then(data => setBookmarks(data))
        .catch(err => console.error('Error loading bookmarks:', err))
    }
  }, [])

  if (!userId) {
    return <p className="text-center mt-10">Please log in to view your watchlist.</p>
  }

  return (
    <div className="py-10">
      <h2 className="text-2xl font-bold mb-6">🎬 Your Bookmarked Movies</h2>
      {bookmarks.length === 0 ? (
        <p>You haven’t bookmarked any movies yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {bookmarks.map(movie => (
            <div key={movie.id} className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold text-black">{movie.title}</h3>
              <p className="text-sm text-gray-500">{movie.genre}</p>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}
