# Data Dictionary

โปรเจกต์: 2HandShop Marketplace

คอลัมน์ที่ใช้ในเอกสารนี้

| Field Name | Data Type | Description | Format/Example | Constraints |
|---|---|---|---|---|

## Collection: `users`

| Field Name | Data Type | Description | Format/Example | Constraints |
|---|---|---|---|---|
| `_id` | ObjectId | รหัสผู้ใช้ | `660f...` | Primary Key, Auto Generated |
| `username` | String | ชื่อผู้ใช้สำหรับระบบ | `kikibibi` | Required, Trim |
| `name` | String | ชื่อที่แสดง | `Kiki Bibi` | Default: `""` |
| `email` | String | อีเมลผู้ใช้ | `user@email.com` | Required, Unique, Lowercase |
| `password` | String | รหัสผ่านที่เข้ารหัสแล้ว | `hashed_password` | Required, Min Length 6 |
| `phone` | String | เบอร์โทรศัพท์ | `0899999999` | Default: `""` |
| `address` | String | ที่อยู่หลัก | `Bangkok, Thailand` | Default: `""` |
| `addresses` | Array of SavedAddress | รายการที่อยู่ที่บันทึกไว้ | `[{...}]` | Max 5 items |
| `avatarUrl` | String | URL รูปโปรไฟล์ | `/uploads/avatar-1.jpg` | Default: `""` |
| `role` | String | สิทธิ์ผู้ใช้ | `user`, `admin` | Default: `user` |
| `banStatus` | String | สถานะบัญชี | `active`, `banned` | Default: `active` |
| `reviewedAt` | Date | วันที่แอดมินตรวจบัญชี | `2026-03-31T10:00:00Z` | Default: `null` |
| `moderationNote` | String | หมายเหตุจากแอดมิน | `Verified account` | Default: `""` |
| `createdAt` | Date | วันที่สร้างข้อมูล | `2026-03-31T10:00:00Z` | Auto Timestamp |
| `updatedAt` | Date | วันที่แก้ไขล่าสุด | `2026-03-31T10:30:00Z` | Auto Timestamp |

### Subdocument: `users.addresses[]`

| Field Name | Data Type | Description | Format/Example | Constraints |
|---|---|---|---|---|
| `id` | String | รหัสที่อยู่ | `addr_001` | Default: `""` |
| `label` | String | ชื่อกำกับที่อยู่ | `บ้าน`, `หอพัก` | Default: `""` |
| `recipientName` | String | ชื่อผู้รับ | `สมชาย ใจดี` | Default: `""` |
| `phone` | String | เบอร์ผู้รับ | `0812345678` | Default: `""` |
| `address` | String | รายละเอียดที่อยู่จัดส่ง | `99/9 กรุงเทพ` | Default: `""` |
| `isDefault` | Boolean | เป็นที่อยู่หลักหรือไม่ | `true`, `false` | Default: `false` |

## Collection: `shops`

| Field Name | Data Type | Description | Format/Example | Constraints |
|---|---|---|---|---|
| `_id` | ObjectId | รหัสร้านค้า | `6610...` | Primary Key |
| `owner` | ObjectId | อ้างอิงเจ้าของร้าน | User `_id` | Required, Unique, Ref: `User` |
| `shopName` | String | ชื่อร้าน | `ร้านค้ามือขาย` | Default: `""` |
| `citizenId` | String | เลขบัตรประชาชนผู้ขาย | `1234567890123` | Default: `""` |
| `birthDate` | String | วันเดือนปีเกิดผู้ขาย | `1999-01-31` | Default: `""` |
| `description` | String | คำอธิบายร้าน | `ขายของมือสอง` | Default: `""` |
| `contact` | String | ช่องทางติดต่อร้าน | `Line: kikibibi` | Default: `""` |
| `avatarUrl` | String | รูปร้าน | `/uploads/shop-1.jpg` | Default: `""` |
| `parcelQrCodeUrl` | String | QR รับชำระค่าส่ง/สินค้า | `/uploads/qr-1.png` | Default: `""` |
| `bankName` | String | ธนาคารสำหรับรับโอน | `กสิกรไทย` | Default: `""` |
| `bankAccountName` | String | ชื่อบัญชีธนาคาร | `สมชาย ใจดี` | Default: `""` |
| `bankAccountNumber` | String | เลขบัญชีธนาคาร | `1234567890` | Default: `""` |
| `kycStatus` | String | สถานะ KYC | `unsubmitted`, `pending`, `approved`, `rejected` | Enum, Default: `unsubmitted` |
| `kycSubmittedAt` | Date | วันที่ส่ง KYC | `2026-03-31T10:00:00Z` | Default: `null` |
| `kycReviewedAt` | Date | วันที่ตรวจ KYC | `2026-03-31T11:00:00Z` | Default: `null` |
| `kycApprovedAt` | Date | วันที่อนุมัติ KYC | `2026-03-31T11:30:00Z` | Default: `null` |
| `moderationNote` | String | หมายเหตุจากแอดมิน | `Approved` | Default: `""` |
| `createdAt` | Date | วันที่สร้างข้อมูล | `2026-03-31T10:00:00Z` | Auto Timestamp |
| `updatedAt` | Date | วันที่แก้ไขล่าสุด | `2026-03-31T10:30:00Z` | Auto Timestamp |

## Collection: `products`

| Field Name | Data Type | Description | Format/Example | Constraints |
|---|---|---|---|---|
| `_id` | ObjectId | รหัสสินค้า | `6611...` | Primary Key |
| `title` | String | ชื่อสินค้า | `iPhone 13` | Required, Trim |
| `description` | String | รายละเอียดสินค้า | `ใช้งานปกติ` | Default: `""` |
| `price` | Number | ราคาสินค้า | `6500` | Required |
| `exchangeItem` | String | ของที่ต้องการแลก | `หนังสือการ์ตูน` | Default: `""` |
| `category` | String | หมวดหมู่สินค้า | `อิเล็กทรอนิกส์` | Required |
| `images` | Array of String | รายการ URL รูปสินค้า | `["/uploads/p1.jpg"]` | Default: `[]` |
| `seller` | ObjectId | ผู้ขายสินค้า | User `_id` | Required, Ref: `User` |
| `status` | String | สถานะสินค้า | `available`, `sold` | Enum, Default: `available` |
| `soldAt` | Date | วันที่ขายสำเร็จ | `2026-03-31T12:00:00Z` | Default: `null` |
| `soldOrderId` | String | ออเดอร์ที่ทำให้สินค้าขายแล้ว | Order `_id` | Default: `""` |
| `createdAt` | Date | วันที่สร้างข้อมูล | `2026-03-31T10:00:00Z` | Auto Timestamp |
| `updatedAt` | Date | วันที่แก้ไขล่าสุด | `2026-03-31T10:30:00Z` | Auto Timestamp |

## Collection: `carts`

| Field Name | Data Type | Description | Format/Example | Constraints |
|---|---|---|---|---|
| `_id` | ObjectId | รหัสตะกร้า | `6612...` | Primary Key |
| `user` | ObjectId | เจ้าของตะกร้า | User `_id` | Required, Unique, Indexed |
| `items` | Array of CartItem | รายการสินค้าในตะกร้า | `[{...}]` | Default: `[]` |
| `createdAt` | Date | วันที่สร้างข้อมูล | `2026-03-31T10:00:00Z` | Auto Timestamp |
| `updatedAt` | Date | วันที่แก้ไขล่าสุด | `2026-03-31T10:30:00Z` | Auto Timestamp |

### Subdocument: `carts.items[]`

| Field Name | Data Type | Description | Format/Example | Constraints |
|---|---|---|---|---|
| `_id` | ObjectId | รหัสรายการในตะกร้า | `6612...` | Auto Generated |
| `product` | ObjectId | อ้างอิงสินค้า | Product `_id` | Required, Ref: `Product` |
| `quantity` | Number | จำนวนสินค้า | `1` | Min 1, Default 1 |
| `createdAt` | Date | วันที่เพิ่มรายการ | `2026-03-31T10:00:00Z` | Auto Timestamp |
| `updatedAt` | Date | วันที่แก้ไขรายการ | `2026-03-31T10:30:00Z` | Auto Timestamp |

## Collection: `orders`

| Field Name | Data Type | Description | Format/Example | Constraints |
|---|---|---|---|---|
| `_id` | ObjectId | รหัสคำสั่งซื้อ | `6613...` | Primary Key |
| `user` | ObjectId | ผู้ซื้อ | User `_id` | Required, Indexed, Ref: `User` |
| `status` | String | สถานะรวมของออเดอร์ | `pending`, `completed` | Default: `pending` |
| `notes` | String | หมายเหตุจากผู้ซื้อ | `โทรก่อนส่ง` | Default: `""` |
| `totalPrice` | Number | ราคารวมทั้งหมด | `1890` | Default: `0` |
| `shopOrders` | Array of ShopOrder | คำสั่งซื้อแยกตามร้าน | `[{...}]` | Default: `[]` |
| `createdAt` | Date | วันที่สร้างข้อมูล | `2026-03-31T10:00:00Z` | Auto Timestamp |
| `updatedAt` | Date | วันที่แก้ไขล่าสุด | `2026-03-31T10:30:00Z` | Auto Timestamp |

### Subdocument: `orders.shopOrders[]`

| Field Name | Data Type | Description | Format/Example | Constraints |
|---|---|---|---|---|
| `shopOrderKey` | String | รหัสคำสั่งซื้อย่อยของร้าน | `shop-001` | Required |
| `ownerId` | ObjectId | เจ้าของร้าน | User `_id` | Required, Ref: `User` |
| `shopId` | ObjectId | ร้านค้าที่เกี่ยวข้อง | Shop `_id` | Ref: `Shop`, Default `null` |
| `shopName` | String | ชื่อร้าน | `ร้านค้ามือขาย` | Default: `""` |
| `shippingMethod` | String | วิธีรับสินค้า | `meetup`, `parcel` | Enum, Default: `meetup` |
| `status` | String | สถานะออเดอร์ย่อย | `pending`, `parcel_in_transit` | Default: `""` |
| `items` | Array of OrderItem | รายการสินค้าในร้านนั้น | `[{...}]` | Default: `[]` |
| `subtotal` | Number | ราคารวมย่อย | `890` | Default: `0` |
| `meetupProposal` | Object | ข้อมูลนัดรับ | `{...}` | Default: `null` |
| `parcelPayment` | Object | ข้อมูลการชำระพัสดุ | `{...}` | Default: `null` |
| `parcelShipment` | Object | ข้อมูลการจัดส่งพัสดุ | `{...}` | Default: `null` |
| `adminReport` | Object | ข้อมูลรายงานถึงแอดมิน | `{...}` | Default: `null` |
| `buyerShippingAddress` | Object | ที่อยู่ปลายทางผู้ซื้อ | `{...}` | Default: `null` |

### Subdocument: `orders.shopOrders[].items[]`

| Field Name | Data Type | Description | Format/Example | Constraints |
|---|---|---|---|---|
| `_id` | ObjectId | รหัสรายการสินค้าในออเดอร์ | `6614...` | Auto Generated |
| `productId` | ObjectId | สินค้าที่ซื้อ | Product `_id` | Required, Ref: `Product` |
| `name` | String | ชื่อสินค้า ณ เวลาสั่งซื้อ | `iPhone 13` | Default: `""` |
| `imageUrl` | String | รูปสินค้า ณ เวลาสั่งซื้อ | `/uploads/p1.jpg` | Default: `""` |
| `price` | Number | ราคาต่อชิ้น | `890` | Default: `0` |
| `quantity` | Number | จำนวน | `1` | Min 1, Default 1 |

### Subdocument: `orders.shopOrders[].parcelPayment`

| Field Name | Data Type | Description | Format/Example | Constraints |
|---|---|---|---|---|
| `qrCodeUrl` | String | QR สำหรับการชำระ | `/uploads/qr-1.png` | Default: `""` |
| `bankName` | String | ธนาคารร้านค้า | `กสิกรไทย` | Default: `""` |
| `bankAccountName` | String | ชื่อบัญชีร้านค้า | `สมชาย ใจดี` | Default: `""` |
| `bankAccountNumber` | String | เลขบัญชีร้านค้า | `1234567890` | Default: `""` |
| `receiptImageUrl` | String | หลักฐานการโอน | `/uploads/slip-1.png` | Default: `""` |
| `paymentMethod` | String | วิธีชำระเงิน | `qr`, `bank_transfer`, `cod` | Default: `""` |
| `status` | String | สถานะการตรวจการชำระ | `pending`, `verified` | Default: `""` |
| `submittedAt` | String | วันที่ผู้ซื้อส่งหลักฐาน | `2026-03-31 10:30` | Default: `""` |
| `verifiedAt` | String | วันที่ผู้ขายตรวจแล้ว | `2026-03-31 11:00` | Default: `""` |
| `verifiedBy` | String | ผู้ตรวจสอบ | User `_id` or name | Default: `""` |

### Subdocument: `orders.shopOrders[].parcelShipment`

| Field Name | Data Type | Description | Format/Example | Constraints |
|---|---|---|---|---|
| `trackingNumber` | String | เลขพัสดุ | `TH123456789` | Default: `""` |
| `carrier` | String | บริษัทขนส่ง | `Flash Express` | Default: `""` |
| `status` | String | สถานะพัสดุ | `preparing`, `shipped` | Default: `""` |
| `note` | String | หมายเหตุการส่ง | `ฝากไว้หน้าห้อง` | Default: `""` |
| `preparedAt` | String | เวลาที่เตรียมส่ง | `2026-03-31 10:00` | Default: `""` |
| `shippedAt` | String | เวลาที่ส่งแล้ว | `2026-03-31 11:00` | Default: `""` |
| `updatedAt` | String | เวลาอัปเดตล่าสุด | `2026-03-31 11:10` | Default: `""` |

### Subdocument: `orders.shopOrders[].buyerShippingAddress`

| Field Name | Data Type | Description | Format/Example | Constraints |
|---|---|---|---|---|
| `addressId` | String | รหัสที่อยู่ที่เลือก | `addr_001` | Default: `""` |
| `label` | String | ชื่อกำกับที่อยู่ | `บ้าน` | Default: `""` |
| `name` | String | ชื่อผู้รับ | `สมหญิง ใจดี` | Default: `""` |
| `phone` | String | เบอร์ผู้รับ | `0812345678` | Default: `""` |
| `address` | String | ที่อยู่จัดส่งจริง | `99/9 กรุงเทพ` | Default: `""` |

## Collection: `chats`

| Field Name | Data Type | Description | Format/Example | Constraints |
|---|---|---|---|---|
| `_id` | ObjectId | รหัสห้องแชท | `6615...` | Primary Key |
| `productId` | ObjectId | สินค้าที่อ้างอิงในแชท | Product `_id` | Required, Indexed, Ref: `Product` |
| `ownerId` | ObjectId | คนขาย | User `_id` | Required, Indexed, Ref: `User` |
| `buyerId` | ObjectId | คนซื้อ | User `_id` | Required, Indexed, Ref: `User` |
| `messages` | Array of ChatMessage | รายการข้อความ | `[{...}]` | Default: `[]` |
| `ownerLastReadAt` | Date | เวลาอ่านล่าสุดของผู้ขาย | `2026-03-31T10:00:00Z` | Default: `null` |
| `buyerLastReadAt` | Date | เวลาอ่านล่าสุดของผู้ซื้อ | `2026-03-31T10:05:00Z` | Default: `null` |
| `createdAt` | Date | วันที่สร้างห้องแชท | `2026-03-31T10:00:00Z` | Auto Timestamp |
| `updatedAt` | Date | วันที่แก้ไขล่าสุด | `2026-03-31T10:30:00Z` | Auto Timestamp |

### Subdocument: `chats.messages[]`

| Field Name | Data Type | Description | Format/Example | Constraints |
|---|---|---|---|---|
| `_id` | ObjectId | รหัสข้อความ | `6616...` | Auto Generated |
| `senderId` | ObjectId | ผู้ส่งข้อความ | User `_id` | Required, Ref: `User` |
| `type` | String | ประเภทข้อความ | `text`, `image`, `video`, `meetup_proposal` | Enum, Default: `text` |
| `orderId` | ObjectId | อ้างอิงคำสั่งซื้อ | Order `_id` | Ref: `Order`, Default `null` |
| `text` | String | ข้อความแชท | `สนใจสินค้าชิ้นนี้` | Default: `""` |
| `imageUrl` | String | URL รูปที่ส่งในแชท | `/uploads/chat-1.jpg` | Default: `""` |
| `videoUrl` | String | URL วิดีโอที่ส่งในแชท | `/uploads/chat-1.mp4` | Default: `""` |
| `meetupProposal` | Object | ข้อมูลข้อเสนอนัดรับ | `{...}` | Default: `null` |
| `createdAt` | Date | วันที่ส่งข้อความ | `2026-03-31T10:00:00Z` | Default: `Date.now` |

## Collection: `reports`

| Field Name | Data Type | Description | Format/Example | Constraints |
|---|---|---|---|---|
| `_id` | ObjectId | รหัสรายงาน | `6617...` | Primary Key |
| `reportType` | String | ประเภทรายงาน | `product`, `shop` | Required, Enum |
| `productId` | ObjectId | สินค้าที่ถูกรายงาน | Product `_id` | Ref: `Product`, Default `null` |
| `productOwnerId` | ObjectId | เจ้าของสินค้า | User `_id` | Ref: `User`, Default `null` |
| `productName` | String | ชื่อสินค้า | `iPhone 13` | Default: `""` |
| `productCategory` | String | หมวดสินค้า | `อิเล็กทรอนิกส์` | Default: `""` |
| `productImageUrl` | String | รูปสินค้า | `/uploads/p1.jpg` | Default: `""` |
| `shopId` | ObjectId | ร้านที่ถูกรายงาน | Shop `_id` | Ref: `Shop`, Default `null` |
| `shopOwnerId` | ObjectId | เจ้าของร้าน | User `_id` | Ref: `User`, Default `null` |
| `shopName` | String | ชื่อร้าน | `ร้านค้ามือขาย` | Default: `""` |
| `shopAvatarUrl` | String | รูปร้าน | `/uploads/shop-1.jpg` | Default: `""` |
| `reporterId` | ObjectId | ผู้รายงาน | User `_id` | Required, Ref: `User` |
| `reporterName` | String | ชื่อผู้รายงาน | `Kiki Bibi` | Default: `""` |
| `reason` | String | เหตุผลที่รายงาน | `ขายของผิดกฎ` | Required |
| `source` | String | หน้าต้นทางที่รายงาน | `product_detail` | Default: `""` |
| `status` | String | สถานะรายงาน | `open`, `dismissed`, `taken_down` | Enum, Default: `open` |
| `resolvedAt` | Date | วันที่ปิดเคส | `2026-03-31T12:00:00Z` | Default: `null` |
| `resolutionNote` | String | หมายเหตุการปิดเคส | `Removed by admin` | Default: `""` |
| `createdAt` | Date | วันที่สร้างรายงาน | `2026-03-31T10:00:00Z` | Auto Timestamp |
| `updatedAt` | Date | วันที่แก้ไขล่าสุด | `2026-03-31T10:30:00Z` | Auto Timestamp |

## Collection: `notifications`

| Field Name | Data Type | Description | Format/Example | Constraints |
|---|---|---|---|---|
| `_id` | ObjectId | รหัสแจ้งเตือน | `6618...` | Primary Key |
| `user` | ObjectId | ผู้รับแจ้งเตือน | User `_id` | Required, Indexed, Ref: `User` |
| `type` | String | ประเภทแจ้งเตือน | `order_created`, `kyc_updated` | Required, Indexed |
| `title` | String | หัวข้อแจ้งเตือน | `ร้านค้าได้ส่งพัสดุแล้ว` | Required |
| `message` | String | รายละเอียดแจ้งเตือน | `เลขพัสดุ 123456` | Default: `""` |
| `target` | Mixed/Object | เป้าหมายปลายทางของแจ้งเตือน | `{ route: "orders", params: {} }` | Default object |
| `metadata` | Mixed/Object | ข้อมูลเสริมสำหรับระบบ | `{ orderId: "..." }` | Default object |
| `readAt` | Date | วันที่อ่านแจ้งเตือน | `2026-03-31T10:00:00Z` | Default: `null`, Indexed |
| `createdAt` | Date | วันที่สร้างข้อมูล | `2026-03-31T10:00:00Z` | Auto Timestamp |
| `updatedAt` | Date | วันที่แก้ไขล่าสุด | `2026-03-31T10:30:00Z` | Auto Timestamp |

## Collection: `categories`

| Field Name | Data Type | Description | Format/Example | Constraints |
|---|---|---|---|---|
| `_id` | ObjectId | รหัสหมวดหมู่ | `6619...` | Primary Key |
| `name` | String | ชื่อหมวดหมู่ | `หนังสือ` | Required, Unique, Trim |
| `description` | String | คำอธิบายหมวดหมู่ | `หนังสือทั่วไป` | Default: `""` |
| `createdAt` | Date | วันที่สร้างข้อมูล | `2026-03-31T10:00:00Z` | Auto Timestamp |
| `updatedAt` | Date | วันที่แก้ไขล่าสุด | `2026-03-31T10:30:00Z` | Auto Timestamp |

## Notes

- `ObjectId` คือคีย์อ้างอิงจาก MongoDB
- ฟิลด์ที่เป็น `Mixed/Object` ใช้สำหรับเก็บข้อมูลยืดหยุ่นตามเหตุการณ์
- หลาย collection ใช้ `timestamps: true` จึงมี `createdAt` และ `updatedAt` อัตโนมัติ
- ถ้าต้องการส่งงานใน Excel สามารถคัดลอกแต่ละตารางไปวางในชีตแยกตาม collection ได้ทันที
