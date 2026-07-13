<?php
// retrieve user credentials for account management page

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "db.php";

$user_id = $_GET['id'] ?? 0;

if (!$user_id) {
  echo json_encode(["error" => "Missing user ID"]);
  exit;
}

// retrieve username and email
$stmt = $conn->prepare("SELECT id, name, email FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();
$data = $result->fetch_assoc();

echo json_encode($data);

$stmt->close();
$conn->close();
?>
