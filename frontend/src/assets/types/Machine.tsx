export interface Machine {
	id: string;
	name: string;
	model: string;
	observations?: string;
	contractId?: string;
	fragranceId?: string;
	medianConsumption?: number;
	price: number;
	isPaid: boolean;
	status: string;
	created_at: string;
}


//   name         String  @db.VarChar(128)
//   model        String  @db.VarChar(64)
//   observations String? @db.Text

//   contractId        String? @db.Uuid
//   fragranceId       String?  @db.Uuid
//   medianConsumption Float?

//   price  Float
//   isPaid Boolean @default(false)

//   status String @default("Available") @db.VarChar(20)

//   lastService DateTime @updatedAt
//   created_at  DateTime @default(now())
