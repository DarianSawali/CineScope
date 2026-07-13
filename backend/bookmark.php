<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db.php";

// read input
$rawInput = file_get_contents("php://input");

// debug log
file_put_contents("debug_log.txt", $rawInput . PHP_EOL, FILE_APPEND);

// decode JSON
$data = json_decode($rawInput, true);

// Check if JSON valid
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON input']);
    exit;
}

// extract user and movie
$user_id = $data['user_id'] ?? null;
$movie_id = $data['movie_id'] ?? null;

// 5. Validate
if (!$user_id || !$movie_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing parameters']);
    exit;
}

// Check if already bookmarked
$stmt = $conn->prepare("SELECT id FROM lists WHERE user_id = ? AND movie_id = ?");
$stmt->bind_param("ii", $user_id, $movie_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    // already bookmarked, remove
    $delete = $conn->prepare("DELETE FROM lists WHERE user_id = ? AND movie_id = ?");
    $delete->bind_param("ii", $user_id, $movie_id);
    $success = $delete->execute();
    echo json_encode([
        'success' => $success,
        'message' => $success ? 'Bookmark removed' : 'Failed to remove bookmark',
        'bookmarked' => false
    ]);
    $delete->close();
} else {
    // not bookmarkedm, insert
    $insert = $conn->prepare("INSERT INTO lists (user_id, movie_id) VALUES (?, ?)");
    $insert->bind_param("ii", $user_id, $movie_id);
    $success = $insert->execute();
    echo json_encode([
        'success' => $success,
        'message' => $success ? 'Bookmarked successfully' : 'Failed to bookmark',
        'bookmarked' => true
    ]);
    $insert->close();
}

$stmt->close();
$conn->close();
