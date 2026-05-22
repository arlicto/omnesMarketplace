<?php

declare(strict_types=1);

namespace App\Controllers\V1;

use App\Config\Validation\InputValidator;
use App\Repositories\CartRepository;
use App\Repositories\ProductRepository;
use App\Support\JsonResponse;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use RuntimeException;

final class CartController
{
    public function __construct(
        private CartRepository $cart,
        private ProductRepository $products,
    ) {
    }

    public function getCart(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');
        if ($userId === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $cart = $this->cart->findActiveByUserId((int) $userId);

        if ($cart === null) {
            return JsonResponse::make([
                'cart' => null,
                'items' => [],
                'summary' => ['subtotal' => 0, 'tax' => 0, 'total' => 0],
            ]);
        }

        $items = $this->cart->getItems((int) $cart['id']);
        $subtotal = 0;
        foreach ($items as &$item) {
            $lineTotal = (float) $item['unit_price'] * (int) $item['quantity'];
            $item['line_total'] = $lineTotal;
            $subtotal += $lineTotal;
        }
        unset($item);

        $tax = round($subtotal * 0.2, 2);
        $total = round($subtotal + $tax, 2);

        return JsonResponse::make([
            'cart' => $cart,
            'items' => $items,
            'summary' => [
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $total,
            ],
        ]);
    }

    public function addItem(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');
        if ($userId === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $data = (array) $request->getParsedBody();
        $productId = isset($data['product_id']) ? (int) $data['product_id'] : 0;
        $quantity = isset($data['quantity']) ? (int) $data['quantity'] : 1;

        try {
            $product = $this->products->findById($productId);
            if ($product === null) {
                return JsonResponse::error('Product not found.', 404);
            }

            if ($quantity < 1) {
                return JsonResponse::error('Quantity must be at least 1.', 400);
            }

            $uuid = $this->generateUuid();
            $cart = $this->cart->findActiveByUserId((int) $userId);

            if ($cart === null) {
                $cartId = $this->cart->create((int) $userId, $uuid);
            } else {
                $cartId = (int) $cart['id'];
            }

            $this->cart->addItem($cartId, $productId, $quantity, (float) $product['price']);

            $items = $this->cart->getItems($cartId);
            $subtotal = 0;
            foreach ($items as &$item) {
                $lineTotal = (float) $item['unit_price'] * (int) $item['quantity'];
                $item['line_total'] = $lineTotal;
                $subtotal += $lineTotal;
            }
            unset($item);

            $tax = round($subtotal * 0.2, 2);
            $total = round($subtotal + $tax, 2);

            return JsonResponse::make([
                'message' => 'Item added to cart.',
                'items' => $items,
                'summary' => [
                    'subtotal' => $subtotal,
                    'tax' => $tax,
                    'total' => $total,
                ],
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return JsonResponse::error($e->getMessage(), 400);
        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }

    public function removeItem(Request $request, Response $response, array $args): Response
    {
        $userId = $request->getAttribute('user_id');
        if ($userId === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $itemId = (int) $args['id'];

        try {
            $cart = $this->cart->findActiveByUserId((int) $userId);
            if ($cart === null) {
                return JsonResponse::error('Cart not found.', 404);
            }

            $removed = $this->cart->removeItem($itemId, (int) $cart['id']);
            if (!$removed) {
                return JsonResponse::error('Item not found in cart.', 404);
            }

            return JsonResponse::make(['message' => 'Item removed from cart.']);
        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }

    private function generateUuid(): string
    {
        $data = random_bytes(16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);

        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
}
