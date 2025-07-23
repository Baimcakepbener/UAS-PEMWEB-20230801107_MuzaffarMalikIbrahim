<?php
$host = "localhost";
$user = "root"; // default XAMPP user
$pass = "";     // default kosong
$dbname = "db_spppayment";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}
?>

