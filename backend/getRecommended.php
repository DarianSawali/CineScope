<?php
// 'for you' movie recommendations in home page for logged in users

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "db.php";

$genres = $_GET['genres'] ?? '';

if (!$genres) {
  echo json_encode([]);
  exit;
}

// explode genre array using ','
$genre = explode(',', $genres);

// WHERE clause with genres
$conditions = array_map(fn($g) => "m.genre LIKE ?", $genre);
$whereClause = implode(" OR ", $conditions);

// select movies that have the same genre as the ones in user preference and ordered by average rating
$sql = "
  SELECT m.*, ROUND(AVG(r.score), 2) AS average_rating
  FROM movies m
  LEFT JOIN ratings r ON m.id = r.movie_id
  WHERE $whereClause
  GROUP BY m.id
  ORDER BY average_rating DESC
  LIMIT 6
";

$stmt = $conn->prepare($sql);

// bind all genres
$types = str_repeat("s", count($genre));
$params = array_map(fn($g) => "%$g%", $genre);
$stmt->bind_param($types, ...$params);

$stmt->execute();
$result = $stmt->get_result();

$movies = [];
while ($row = $result->fetch_assoc()) {
  $movies[] = $row;
}

echo json_encode($movies);
