<?php
// add comment backend

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  echo json_encode(["error" => "Only POST requests allowed"]);
  exit;
}

require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

// get user id, movie id, and comment content
$user_id = $data["user_id"] ?? null;
$movie_id = $data["movie_id"] ?? null;
$content = $data["content"] ?? '';

if (!$user_id || !$movie_id || !$content) {
  echo json_encode(["error" => "Missing required fields"]);
  exit;
}

$stmt = $conn->prepare("INSERT INTO comments (user_id, movie_id, content) VALUES (?, ?, ?)");
$stmt->bind_param("iis", $user_id, $movie_id, $content);

if ($stmt->execute()) {
  echo json_encode(["success" => true, "message" => "Comment added"]);
} else {
  echo json_encode(["error" => "Failed to add comment"]);
}
