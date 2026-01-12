<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid Request Method']);
    exit;
}

$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$message = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message'])) : '';

if (empty($email) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Prosím vyplňte platný email a zprávu.']);
    exit;
}

$to = 'admin@fitnessguide.cz';
$subject = 'Nová zpráva z webu FitnessGuide';
$headers = "From: " . $email . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$body = "Máte novou zprávu od: $email\n\n";
$body .= "Zpráva:\n$message\n";

$mailSent = true;

if ($mailSent) {
    echo json_encode(['status' => 'success', 'message' => 'Email sent successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Chyba při odesílání emailu.']);
}
?>