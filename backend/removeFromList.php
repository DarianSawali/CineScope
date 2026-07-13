<?php
// remove bookmarked movie from list

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once "db.php";

$data = json_decode(file_get_contents("php://input"));

$user_id = $data->user_id ?? null;
$movie_id = $data->movie_id ?? null;

if (!$user_id || !$movie_id) {
    echo json_encode(["error" => "Missing user_id or movie_id"]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM lists WHERE user_id = ? AND movie_id = ?");
$stmt->bind_param("ii", $user_id, $movie_id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Movie removed from bookmarks"]);
} else {
    echo json_encode(["error" => "Failed to remove bookmark"]);
}

$conn->close();
?>
