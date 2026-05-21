<?php
namespace App\Controllers\V1;

use App\Database;
use App\Models\User;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Firebase\JWT\JWT;

class AuthController {
    private $db;
    private $key = "your_secret_key"; // Should be in .env

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function register(Request $request, Response $response) {
        $data = json_decode($request->getBody(), true);
        
        if (empty($data['username']) || empty($data['email']) || empty($data['password'])) {
            $response->getBody()->write(json_encode(["message" => "Incomplete data."]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $user = new User($this->db);
        $user->username = $data['username'];
        $user->email = $data['email'];
        $user->password = $data['password'];

        if ($user->create()) {
            $response->getBody()->write(json_encode(["message" => "User was created."]));
            return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode(["message" => "Unable to create user."]));
        return $response->withStatus(503)->withHeader('Content-Type', 'application/json');
    }

    public function login(Request $request, Response $response) {
        $data = json_decode($request->getBody(), true);
        
        $user = new User($this->db);
        $user->email = $data['email'];
        $email_exists = $user->emailExists();

        if ($email_exists && password_verify($data['password'], $user->password)) {
            $token = [
                "iat" => time(),
                "exp" => time() + 3600,
                "data" => [
                    "id" => $user->id,
                    "username" => $user->username,
                    "email" => $user->email
                ]
            ];

            $jwt = JWT::encode($token, $this->key, 'HS256');

            $response->getBody()->write(json_encode([
                "message" => "Successful login.",
                "jwt" => $jwt,
                "user" => [
                    "id" => $user->id,
                    "username" => $user->username,
                    "email" => $user->email
                ]
            ]));
            return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode(["message" => "Login failed."]));
        return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
    }
}
