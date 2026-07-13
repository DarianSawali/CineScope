<?php
// change user password

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo json_encode(["error" => "Only POST allowed"]);
  exit;
}

require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

// extract data
$user_id = $data['user_id'] ?? '';
$current_password = $data['current_password'] ?? '';
$new_password = $data['new_password'] ?? '';

if (!$user_id || !$current_password || !$new_password) {
  echo json_encode(["error" => "Missing fields"]);
  exit;
}

// get existing hashed password
$stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
  // validate current password
  if (!password_verify($current_password, $row['password'])) {
    echo json_encode(["error" => "Incorrect current password"]);
    exit;
  }

  // hash and update new password
  $new_hashed = password_hash($new_password, PASSWORD_DEFAULT);
  $updateStmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
  $updateStmt->bind_param("si", $new_hashed, $user_id);

  if ($updateStmt->execute()) {
    echo json_encode(["success" => true]);
  } else {
    echo json_encode(["error" => "Failed to update password"]);
  }
} else {
  echo json_encode(["error" => "User not found"]);
}
