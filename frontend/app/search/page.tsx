'use client'

import $ from 'jquery'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import MovieCard from '@/components/MovieCard'

type Movie = {
  id: number
  title: string
  genre: string
  language: string
  release_date: string
  poster_path: string
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_KEY

const GENRES = [
  "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime",
  "Drama", "Family", "Fantasy", "Game-Show", "History", "Horror",
  "Music", "Musical", "Mystery", "Reality-TV", "Romance", "Sci-Fi",
  "Sport", "Thriller", "War", "Western"
]

const LANGUAGES = [
  "Arabic", "Armenian", "Bulgarian", "Danish", "English", "French", "German",
  "Hebrew", "Hungarian", "Italian", "Japanese", "Latin", "Polish",
  "Romanian", "Russian", "Spanish", "Telugu", "Yiddish"
]

export default function SearchPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('')

  useEffect(() => {
    // Fetch movies from the backend scripts
    const url = new URL(`${BASE_URL}/getSearch.php`)
    if (searchTerm) url.searchParams.append('title', searchTerm)
    if (selectedGenre) url.searchParams.append('genre', selectedGenre)
    if (selectedLanguage) url.searchParams.append('language', selectedLanguage)

    // AJAX
    $.ajax({
      url: url.href, 
      method: 'GET',
      dataType: 'json',
      success: async function (data) {
        const isUnfiltered = !searchTerm && !selectedGenre && !selectedLanguage
        const limitedData = isUnfiltered ? data.slice(0, 15) : data

        const enriched = await Promise.all(
          limitedData.map(async (movie: any) => {
            let poster_path = ''
            // Check if the movie has a poster_path
            try {
              // Fetch poster path from TMDb API
              const tmdbRes = await fetch(
                `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movie.title)}&api_key=${TMDB_API_KEY}`
              )
              const tmdbData = await tmdbRes.json()
              poster_path = tmdbData.results?.[0]?.poster_path || ''
            } catch (err) {
              console.error('TMDb error:', err)
            }

            return {
              ...movie,
              release_date: movie.release_date || '2000-01-01',
              poster_path,
              genreList: movie.genre.split(',').map((g: string) => g.trim()),
              languageList: movie.language.split(',').map((l: string) => l.trim()),
            }
          })
        )

        setMovies(enriched)
      },
      error: function (xhr, status, err) {
        console.error('AJAX error:', err)
      }
    })
  }, [searchTerm, selectedGenre, selectedLanguage])

  return (


    <div className="py-10 text-white">
      <h2 className="text-3xl font-bold mb-6 ">Search & Filter Movies</h2>

      <div className="py-10 flex flex-col items-center justify-center mb-8">
        <div className="relative w-full max-w-xl">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-6 pr-14 py-3 rounded-full bg-transparent text-white placeholder-gray-400 border border-white focus:outline-none"
          />
          <button
            onClick={() => { }} 
            className="absolute right-1 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full transition duration-300 outline-gray-600 hover:bg-gradient-to-r hover:from-fuchsia-600 hover:to-violet-900"
          >
            <AiOutlineSearch size={24} />
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <div className="relative w-full sm:w-[130px]">
            <select
              value={selectedGenre}
              onChange={e => setSelectedGenre(e.target.value)}
              className="appearance-none w-full p-3 pr-10 border border-white rounded-3xl bg-black text-white"
            >
              <option value="">All Genres</option>
              {GENRES.map((genre, idx) => (
                <option key={idx} value={genre}>{genre}</option>
              ))}
            </select>

            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="relative w-full sm:w-[160px]">
            <select
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value)}
              className="appearance-none w-full p-3 pr-10 border border-white rounded-3xl bg-black"
            >
              <option value="">All Languages</option>
              {LANGUAGES.map((lang, idx) => (
                <option key={idx} value={lang}>{lang}</option>
              ))}
            </select>

            {/* dropdown tab */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* movie cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {movies.map(movie => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              release_date={movie.release_date}
            />
        ))}
      </div>
    </div>
  )
}
