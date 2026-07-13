<?php
// logged in user, update preference

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data['user_id'] ?? 0;
$genre = $data['genre_preference'] ?? '';

// prepare statement for incoming genre_preference changes to the user
$stmt = $conn->prepare("UPDATE users SET genre_preference = ? WHERE id = ?");
$stmt->bind_param("si", $genre, $user_id);

// update genre_preference
$success = $stmt->execute();
echo json_encode(["success" => $success]);

$stmt->close();
$conn->close();
?>
