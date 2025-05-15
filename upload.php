<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'] ?? '';
    $artist = $_POST['artist'] ?? '';
    $genre = $_POST['genre'] ?? '';

    // Save uploaded file
    $uploadDir = 'music/';
    $fileName = basename($_FILES['audio']['name']);
    $filePath = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES['audio']['tmp_name'], $filePath)) {
        // Load existing tracks
        $jsonFile = 'tracks.json';
        $tracks = file_exists($jsonFile) ? json_decode(file_get_contents($jsonFile), true) : [];

        // Append new track
        $tracks[] = [
            'title' => $title,
            'artist' => $artist,
            'genre' => $genre,
            'file' => $filePath
        ];

        // Save back to JSON
        file_put_contents($jsonFile, json_encode($tracks, JSON_PRETTY_PRINT));
        echo "✅ Track uploaded successfully.";
    } else {
        echo "❌ Failed to upload audio file.";
    }
} else {
    echo "Invalid request.";
}
