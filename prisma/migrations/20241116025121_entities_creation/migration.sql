-- CreateTable
CREATE TABLE "Categories" (
    "category_id" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "inventory_id" INTEGER NOT NULL,
    "inventory_name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("inventory_id")
);

-- CreateTable
CREATE TABLE "Products" (
    "product_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "inventory_id" INTEGER NOT NULL,
    "product_name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(100),

    CONSTRAINT "Products_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "Customers" (
    "customer_id" INTEGER NOT NULL,
    "customer_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(50),
    "password" VARCHAR(50) NOT NULL,

    CONSTRAINT "Customers_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "PaymentType" (
    "payment_type" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "PaymentType_pkey" PRIMARY KEY ("payment_type")
);

-- CreateTable
CREATE TABLE "OrderType" (
    "order_type" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "OrderType_pkey" PRIMARY KEY ("order_type")
);

-- CreateTable
CREATE TABLE "Orders" (
    "order_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "order_date" DATE NOT NULL,
    "order_type" INTEGER NOT NULL,
    "payment_type" INTEGER NOT NULL,
    "total_paid" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "OrderProducts" (
    "shipment_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "shipment_date" DATE NOT NULL,

    CONSTRAINT "OrderProducts_pkey" PRIMARY KEY ("shipment_id")
);

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Categories"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "Inventory"("inventory_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customers"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_order_type_fkey" FOREIGN KEY ("order_type") REFERENCES "OrderType"("order_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_payment_type_fkey" FOREIGN KEY ("payment_type") REFERENCES "PaymentType"("payment_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderProducts" ADD CONSTRAINT "OrderProducts_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderProducts" ADD CONSTRAINT "OrderProducts_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
