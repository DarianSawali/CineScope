<?php
// going to movie page

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$id = $_GET['id'] ?? null;

require_once "db.php";

if (!$id) {
  echo json_encode(["error" => "Missing movie ID"]);
  exit;
}

// select all attributes of movie based on its id
$stmt = $conn->prepare("SELECT * FROM movies WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

$movie = $result->fetch_assoc();
echo json_encode($movie);

$conn->close();
?>