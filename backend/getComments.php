<?php
// retrieve comments

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "db.php";

$movie_id = $_GET["movie_id"] ?? null;

if (!$movie_id) {
  echo json_encode(["error" => "Movie ID required"]);
  exit;
}

// select content(comments), and name of user
$sql = "SELECT c.content, u.name 
        FROM comments c 
        JOIN users u ON c.user_id = u.id 
        WHERE c.movie_id = ?
        ORDER BY c.id DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $movie_id);
$stmt->execute();

$result = $stmt->get_result();
$comments = [];

while ($row = $result->fetch_assoc()) {
  $comments[] = $row;
}

echo json_encode($comments);
