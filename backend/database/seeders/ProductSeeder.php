<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Mechanical Disc Brake Caliper',
                'sku' => 'BLD-180-01',
                'category' => 'braking-system',
                'brand' => 'BOLIDS',
                'price' => 650,
                'cost_price' => 420,
                'quantity' => 12,
                'min_stock' => 5,
                'max_capacity' => 25,
                'location' => 'Warehouse shelf a1',
                'status' => 'in-stock',
                'image' => '/images/products/bolids-disc-brake-caliper.jpg',
            ],
            [
                'name' => 'Disc Brake Pads with Spring',
                'sku' => 'PAD-DSK-01',
                'category' => 'braking-system',
                'brand' => 'Universal',
                'price' => 180,
                'cost_price' => 95,
                'quantity' => 24,
                'min_stock' => 8,
                'max_capacity' => 50,
                'location' => 'Warehouse shelf a2',
                'status' => 'in-stock',
                'image' => '/images/products/universal-disc-brake-pads.jpg',
            ],
            [
                'name' => 'CN-HG53 9-Speed Chain (116L)',
                'sku' => 'CN-HG53-01',
                'category' => 'drivetrain-chains',
                'brand' => 'Shimano',
                'price' => 400,
                'cost_price' => 280,
                'quantity' => 15,
                'min_stock' => 5,
                'max_capacity' => 30,
                'location' => 'Warehouse shelf b1',
                'status' => 'in-stock',
                'image' => '/images/products/shimano-cn-hg53-chain.jpg',
            ],
            [
                'name' => 'Bicycle Cassette',
                'sku' => 'BCK-CAS-01',
                'category' => 'drivetrain-chains',
                'brand' => 'BUCKLOS',
                'price' => 850,
                'cost_price' => 560,
                'quantity' => 8,
                'min_stock' => 4,
                'max_capacity' => 20,
                'location' => 'Warehouse shelf b2',
                'status' => 'in-stock',
                'image' => '/images/products/bucklos-bicycle-cassette.jpg',
            ],
            [
                'name' => '13T CNC Jockey Wheel Pulley',
                'sku' => 'MRC-13T-01',
                'category' => 'drivetrain-chains',
                'brand' => 'MEROCA',
                'price' => 165,
                'cost_price' => 90,
                'quantity' => 20,
                'min_stock' => 6,
                'max_capacity' => 40,
                'location' => 'Warehouse shelf b3',
                'status' => 'in-stock',
                'image' => '/images/products/meroca-13t-jockey-wheel.jpg',
            ],
            [
                'name' => 'R-500 1x Crankset with Chainring',
                'sku' => 'RGS-R500-01',
                'category' => 'drivetrain-chains',
                'brand' => 'RAGUSA',
                'price' => 1250,
                'cost_price' => 850,
                'quantity' => 12,
                'min_stock' => 4,
                'max_capacity' => 25,
                'location' => 'Warehouse shelf b4',
                'status' => 'in-stock',
                'image' => '/images/products/ragusa-r500-crankset.jpg',
            ],
            [
                'name' => '6061-T6 Alloy Handlebar (31.8mm)',
                'sku' => 'INSP-HB-01',
                'category' => 'handle-bar-handle-grip',
                'brand' => 'INSPEED',
                'price' => 650,
                'cost_price' => 420,
                'quantity' => 14,
                'min_stock' => 5,
                'max_capacity' => 30,
                'location' => 'Warehouse shelf c1',
                'status' => 'in-stock',
                'image' => '/images/products/inspeed-alloy-handlebar.jpg',
            ],
            [
                'name' => 'Dual Lock-On Handlebar Grips (Purple)',
                'sku' => 'GRP-LCK-PRP-01',
                'category' => 'handle-bar-handle-grip',
                'brand' => 'Universal',
                'price' => 280,
                'cost_price' => 150,
                'quantity' => 22,
                'min_stock' => 8,
                'max_capacity' => 45,
                'location' => 'Warehouse shelf c2',
                'status' => 'in-stock',
                'image' => '/images/products/universal-purple-lock-on-grips.jpg',
            ],
        ];

        foreach ($products as $data) {
            Product::firstOrCreate(
                ['sku' => $data['sku']],
                $data
            );
        }
    }
}
