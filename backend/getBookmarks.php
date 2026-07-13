<?php
// get list of bookmarked movies by user

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "db.php"; 

if (!isset($_GET["user_id"])) {
  echo json_encode(["error" => "User ID required"]);
  exit;
}

$user_id = intval($_GET["user_id"]);

// prepare sql statement, user_id = ?
$sql = "SELECT m.id, m.title, m.genre, m.release_date
        FROM lists l
        JOIN movies m ON l.movie_id = m.id
        WHERE l.user_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();
$bookmarks = [];

// retrieve bookmarked movies
while ($row = $result->fetch_assoc()) {
  $bookmarks[] = $row;
}

echo json_encode($bookmarks);
