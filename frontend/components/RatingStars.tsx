'use client'

import { useEffect, useState } from 'react'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'

type Props = {
  movieId: number
  userId: number | null
  readonly?: boolean
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

export default function RatingStars({ movieId, userId, readonly = false }: Props) {
  const [rating, setRating] = useState<number>(0)
  const [hovered, setHovered] = useState<number | null>(null)

  useEffect(() => {
    if (!userId) return
  
    // fetching the rating from the backend scripts
    fetch(`${BASE_URL}/getRating.php?user_id=${userId}&movie_id=${movieId}`)
      .then(res => res.json())
      .then(data => setRating(data.score || 0))
      .catch(err => console.error("Error fetching rating:", err))
  }, [movieId, userId])

  // Function to handle rating
  const handleRating = async (score: number) => {
    if (readonly || !userId) return

    try {
      await fetch(`${BASE_URL}/rateMovie.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, movie_id: movieId, score }),
      })
      setRating(score)
    } catch (err) {
      console.error("Rating error:", err)
    }
  }

  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3, 4, 5].map(i => {
        const isFilled = i <= (hovered ?? rating)

        return readonly ? (
          <div key={i} className="text-yellow-400 cursor-default">
            {isFilled ? <AiFillStar size={20} /> : <AiOutlineStar size={20} />}
          </div>
        ) : (
          <button
            key={i}
            onClick={() => handleRating(i)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="text-yellow-400"
          >
            {isFilled ? <AiFillStar size={20} /> : <AiOutlineStar size={20} />}
          </button>
        )
      })}
    </div>
  )
}
