-- AlterTable
CREATE SEQUENCE categories_category_id_seq;
ALTER TABLE "Categories" ALTER COLUMN "category_id" SET DEFAULT nextval('categories_category_id_seq');
ALTER SEQUENCE categories_category_id_seq OWNED BY "Categories"."category_id";

-- AlterTable
CREATE SEQUENCE customers_customer_id_seq;
ALTER TABLE "Customers" ALTER COLUMN "customer_id" SET DEFAULT nextval('customers_customer_id_seq');
ALTER SEQUENCE customers_customer_id_seq OWNED BY "Customers"."customer_id";

-- AlterTable
CREATE SEQUENCE inventory_inventory_id_seq;
ALTER TABLE "Inventory" ALTER COLUMN "inventory_id" SET DEFAULT nextval('inventory_inventory_id_seq');
ALTER SEQUENCE inventory_inventory_id_seq OWNED BY "Inventory"."inventory_id";

-- AlterTable
CREATE SEQUENCE orderproducts_shipment_id_seq;
ALTER TABLE "OrderProducts" ALTER COLUMN "shipment_id" SET DEFAULT nextval('orderproducts_shipment_id_seq');
ALTER SEQUENCE orderproducts_shipment_id_seq OWNED BY "OrderProducts"."shipment_id";

-- AlterTable
CREATE SEQUENCE ordertype_order_type_seq;
ALTER TABLE "OrderType" ALTER COLUMN "order_type" SET DEFAULT nextval('ordertype_order_type_seq');
ALTER SEQUENCE ordertype_order_type_seq OWNED BY "OrderType"."order_type";

-- AlterTable
CREATE SEQUENCE orders_order_id_seq;
ALTER TABLE "Orders" ALTER COLUMN "order_id" SET DEFAULT nextval('orders_order_id_seq');
ALTER SEQUENCE orders_order_id_seq OWNED BY "Orders"."order_id";

-- AlterTable
CREATE SEQUENCE paymenttype_payment_type_seq;
ALTER TABLE "PaymentType" ALTER COLUMN "payment_type" SET DEFAULT nextval('paymenttype_payment_type_seq');
ALTER SEQUENCE paymenttype_payment_type_seq OWNED BY "PaymentType"."payment_type";

-- AlterTable
CREATE SEQUENCE products_product_id_seq;
ALTER TABLE "Products" ALTER COLUMN "product_id" SET DEFAULT nextval('products_product_id_seq');
ALTER SEQUENCE products_product_id_seq OWNED BY "Products"."product_id";
