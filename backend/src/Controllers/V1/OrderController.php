<?php

declare(strict_types=1);

namespace App\Controllers\V1;

use App\Config\Validation\InputValidator;
use App\Repositories\CartRepository;
use App\Repositories\OrderRepository;
use App\Repositories\ProductRepository;
use App\Support\JsonResponse;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use RuntimeException;

final class OrderController
{
    public function __construct(
        private CartRepository $cart,
        private OrderRepository $orders,
        private ProductRepository $products,
    ) {
    }

    public function create(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');
        if ($userId === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $data = (array) $request->getParsedBody();

        try {
            $shippingAddress = InputValidator::string($data['shipping_address'] ?? '', 1, 500);
            $notes = InputValidator::string($data['notes'] ?? '', 0, 1000);

            $cart = $this->cart->findActiveByUserId((int) $userId);
            if ($cart === null) {
                return JsonResponse::error('Cart is empty.', 400);
            }

            $items = $this->cart->getItems((int) $cart['id']);
            if (empty($items)) {
                return JsonResponse::error('Cart is empty.', 400);
            }

            $orderUuid = $this->generateUuid();
            $orderNumber = 'ORD-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));

            $subtotal = 0;
            foreach ($items as $item) {
                $lineTotal = (float) $item['unit_price'] * (int) $item['quantity'];
                $subtotal += $lineTotal;
            }

            $taxAmount = round($subtotal * 0.2, 2);
            $totalAmount = round($subtotal + $taxAmount, 2);

            $orderId = $this->orders->create([
                'uuid' => $orderUuid,
                'buyer_id' => (int) $userId,
                'order_number' => $orderNumber,
                'status' => 'pending',
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'shipping_amount' => 0,
                'total_amount' => $totalAmount,
                'shipping_address' => $shippingAddress,
                'notes' => $notes,
            ]);

            foreach ($items as $item) {
                $productId = (int) $item['product_id'];
                $product = $this->products->findById($productId);
                $sellerId = $product['seller_id'] ?? 0;
                $lineTotal = (float) $item['unit_price'] * (int) $item['quantity'];

                $this->orders->createOrderItem([
                    'order_id' => $orderId,
                    'product_id' => $productId,
                    'seller_id' => (int) $sellerId,
                    'product_name' => $item['name'],
                    'product_slug' => strtolower(str_replace(' ', '-', preg_replace('/[^a-zA-Z0-9\s-]/', '', $item['name']))),
                    'quantity' => (int) $item['quantity'],
                    'unit_price' => (float) $item['unit_price'],
                    'line_total' => $lineTotal,
                ]);
            }

            $this->cart->markConverted((int) $cart['id']);

            return JsonResponse::make([
                'message' => 'Order created successfully.',
                'order' => [
                    'id' => $orderId,
                    'uuid' => $orderUuid,
                    'order_number' => $orderNumber,
                    'status' => 'pending',
                    'total_amount' => $totalAmount,
                ],
            ], 201);

        } catch (\InvalidArgumentException $e) {
            return JsonResponse::error($e->getMessage(), 400);
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
