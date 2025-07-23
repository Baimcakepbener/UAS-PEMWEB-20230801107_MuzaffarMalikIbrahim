<?php
include 'db.php';

$username = $_POST['username'];
$password = $_POST['password'];

$sql = "SELECT * FROM petugas WHERE username='$username' AND password='$password'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error"]);
}
$conn->close();
?>