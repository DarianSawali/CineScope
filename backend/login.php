<?php
// login script

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  echo json_encode(["error" => "Only POST requests allowed"]);
  exit;
}

require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$email = $data["email"] ?? '';
$password = $data["password"] ?? '';

// if fields are not filled
if (!$email || !$password) {
  echo json_encode(["error" => "Missing email or password"]);
  exit;
}

$stmt = $conn->prepare("SELECT id, name, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

// if email not found
if ($result->num_rows === 0) {
  echo json_encode(["error" => "User not found"]);
  exit;
}

$user = $result->fetch_assoc();

// check password with stored password using password_verify
if (!password_verify($password, $user["password"])) {
  echo json_encode(["error" => "Incorrect password"]);
  exit;
}

echo json_encode([
  "success" => true,
  "message" => "Login successful",
  "user" => [
    "id" => $user["id"],
    "name" => $user["name"]
  ]
]);
