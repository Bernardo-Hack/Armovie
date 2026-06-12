export interface Item {
	id: string;
	name: string;
	category: string;
	supplier: string;
	stock: number;
	minStock: number;
	averageCost: number;
	description: string;
	notes?: string;
	status: string;
	created_at: string;
	updated_at: string;
};

// - Model definition for Item in Prisma schema (for reference):

// id String @id @default(uuid(7)) @db.Uuid

//   name     String @db.VarChar(128)
//   category String @db.VarChar(64)
//   supplier String @db.VarChar(128)

//   stock       Int // for fragrances: milliliters in stock
//   minStock    Int // for fragrances: minimum stock level in milliliters
//   averageCost Float // for fragrances: price per ml
//   description String  @db.Text
//   notes       String? @db.Text

//   status String @default("active") @db.VarChar(16)

//   created_at DateTime @default(now())
//   updated_at DateTime @updatedAt
