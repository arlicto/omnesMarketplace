<?php
namespace App\Controllers\V1;

use App\Database;
use App\Models\Product;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ProductController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function getAll(Request $request, Response $response) {
        $product = new Product($this->db);
        $stmt = $product->read();
        $num = $stmt->rowCount();

        if ($num > 0) {
            $products_arr = array();
            while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
                extract($row);
                $product_item = array(
                    "id" => $id,
                    "name" => $name,
                    "description" => html_entity_decode($description),
                    "price" => $price,
                    "seller_id" => $seller_id,
                    "seller_name" => $seller_name,
                    "created_at" => $created_at
                );
                array_push($products_arr, $product_item);
            }
            $response->getBody()->write(json_encode($products_arr));
            return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode(array()));
        return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }

    public function getOne(Request $request, Response $response, array $args) {
        $product = new Product($this->db);
        $product->id = $args['id'];

        if ($product->readOne()) {
            $product_arr = array(
                "id" => $product->id,
                "name" => $product->name,
                "description" => $product->description,
                "price" => $product->price,
                "seller_id" => $product->seller_id,
                "created_at" => $product->created_at
            );
            $response->getBody()->write(json_encode($product_arr));
            return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode(array("message" => "Product does not exist.")));
        return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
    }

    public function create(Request $request, Response $response) {
        $data = json_decode($request->getBody(), true);

        if (empty($data['name']) || empty($data['price']) || empty($data['seller_id'])) {
            $response->getBody()->write(json_encode(array("message" => "Incomplete data.")));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $product = new Product($this->db);
        $product->name = $data['name'];
        $product->price = $data['price'];
        $product->description = $data['description'] ?? "";
        $product->seller_id = $data['seller_id'];

        if ($product->create()) {
            $response->getBody()->write(json_encode(array("message" => "Product was created.")));
            return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode(array("message" => "Unable to create product.")));
        return $response->withStatus(503)->withHeader('Content-Type', 'application/json');
    }
}
