<?php
// logged in user preference 

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "db.php";

$user_id = $_GET['user_id'] ?? 0;

// get user genre preference
$stmt = $conn->prepare("SELECT genre_preference FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();
$data = $result->fetch_assoc();

echo json_encode($data);

$stmt->close();
$conn->close();
?>
