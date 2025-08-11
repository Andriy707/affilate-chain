-- CreateTable
CREATE TABLE "leads" (
    "lead_id" TEXT NOT NULL,
    "ip_address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("lead_id")
);

-- CreateTable
CREATE TABLE "actions" (
    "action_id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "action_type" TEXT NOT NULL,
    "session_id" TEXT,
    "offer_id" TEXT,
    "offer_position" INTEGER,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actions_pkey" PRIMARY KEY ("action_id")
);

-- CreateTable
CREATE TABLE "offers" (
    "offer_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "savings_text" TEXT NOT NULL,
    "affiliate_url" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("offer_id")
);

-- CreateIndex
CREATE INDEX "offers_position_idx" ON "offers"("position");

-- CreateIndex
CREATE INDEX "offers_is_active_idx" ON "offers"("is_active");

-- AddForeignKey
ALTER TABLE "actions" ADD CONSTRAINT "actions_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("lead_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actions" ADD CONSTRAINT "actions_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("offer_id") ON DELETE SET NULL ON UPDATE CASCADE;
