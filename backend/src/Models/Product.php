<?php
namespace App\Models;

use PDO;

class Product {
    private $conn;
    private $table_name = "products";

    public $id;
    public $name;
    public $description;
    public $price;
    public $seller_id;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = "SELECT p.id, p.name, p.description, p.price, p.seller_id, p.created_at, u.username as seller_name
                FROM " . $this->table_name . " p
                LEFT JOIN users u ON p.seller_id = u.id
                ORDER BY p.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    public function readOne() {
        $query = "SELECT p.id, p.name, p.description, p.price, p.seller_id, p.created_at, u.username as seller_name
                FROM " . $this->table_name . " p
                LEFT JOIN users u ON p.seller_id = u.id
                WHERE p.id = ?
                LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->name = $row['name'];
            $this->description = $row['description'];
            $this->price = $row['price'];
            $this->seller_id = $row['seller_id'];
            $this->created_at = $row['created_at'];
            return true;
        }

        return false;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET name=:name, description=:description, price=:price, seller_id=:seller_id";
        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->seller_id = htmlspecialchars(strip_tags($this->seller_id));

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":seller_id", $this->seller_id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
