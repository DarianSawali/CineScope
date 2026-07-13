<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "db.php";

// GET user_id and movie_id 
$user_id = $_GET['user_id'] ?? 0;
$movie_id = $_GET['movie_id'] ?? 0;

// by default, bookmarked = false
$response = ['bookmarked' => false];

if ($user_id && $movie_id) {
    $stmt = $conn->prepare("SELECT id FROM lists WHERE user_id = ? AND movie_id = ?");
    $stmt->bind_param("ii", $user_id, $movie_id);
    $stmt->execute();
    $result = $stmt->get_result();

    // if bookmarked, set bookmark as true
    if ($result && $result->num_rows > 0) {
        $response['bookmarked'] = true;
    }

    $stmt->close();
}

echo json_encode($response);
$conn->close();
