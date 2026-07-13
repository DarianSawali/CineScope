'use client'

import { useState, useEffect } from 'react'

type Props = {
  movieId: number
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

export default function Comments({ movieId }: Props) {
  const [comments, setComments] = useState<{ name: string; content: string }[]>([])
  const [newComment, setNewComment] = useState("")
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const id = localStorage.getItem('user_id')
    setUserId(id)

    // Fetch comments for the specific movie
    fetch(`${BASE_URL}/getComments.php?movie_id=${movieId}`)
      .then(res => res.json())
      .then(data => setComments(data))
  }, [movieId])

  // Function to handle posting a new comment
  const handlePost = async () => {
    if (!newComment.trim() || !userId) return

    const res = await fetch(`${BASE_URL}/addComment.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        movie_id: movieId,
        content: newComment
      })
    })

    const data = await res.json()

    // Check if the comment was successfully posted
    if (data.success) {
      setComments(prev => [{ name: "You", content: newComment }, ...prev])
      setNewComment("")
    }
  }

  return (
    <div className="mt-6">
      {/* <h3 className="text-xl font-semibold mb-3">Comments</h3> */}

      {userId ? (
        <div className="mb-4">
          <textarea
            className="w-full p-4 border rounded-xl"
            placeholder="Leave a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            onClick={handlePost}
            className="mt-2 px-4 py-2 border border-white bg-transparent text-white rounded-xl hover:bg-gradient-to-r hover:from-fuchsia-600 hover:to-violet-900 transition duration-300"
          >
            Post
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-600 mb-4">You must be logged in to comment.</p>
      )}

      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        <ul className="space-y-2">
          {comments.map((comment, idx) => (
            <li key={idx} className="border-b p-4 ">
              <strong>{comment.name}</strong>
              <p className='p-2'>{comment.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
