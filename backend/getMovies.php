<?php
// get movies to be shown in the home page

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "db.php";

if (!$conn || $conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed', 'details' => $conn->connect_error]);
    exit;
}

// limit to 20 movies ordered by the latest
$sql = "SELECT id, title, genre, release_date FROM movies ORDER BY release_date DESC LIMIT 20";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(['error' => 'Query failed', 'details' => $conn->error]);
    exit;
}

$movies = [];
while ($row = $result->fetch_assoc()) {
    $movies[] = $row;
}

echo json_encode($movies);
?>
