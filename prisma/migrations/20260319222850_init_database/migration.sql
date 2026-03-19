-- CreateTable
CREATE TABLE `transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `transactions_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entityId` INTEGER NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `oldValue` TEXT NULL,
    `newValue` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Procedure
CREATE PROCEDURE GetChartData(IN startDate DATETIME, IN endDate DATETIME)
BEGIN
    SELECT 
        category AS label, 
        SUM(amount) AS value,
        COUNT(*) AS quantity
    FROM transactions
    WHERE createdAt BETWEEN startDate AND endDate
    GROUP BY category;
END;

-- Trigger
CREATE TRIGGER after_transaction_update
AFTER UPDATE ON transactions
FOR EACH ROW
BEGIN
    IF OLD.amount <> NEW.amount THEN
        INSERT INTO audit_logs (entityId, action, oldValue, newValue)
        VALUES (NEW.id, 'UPDATE_AMOUNT', CAST(OLD.amount AS CHAR), CAST(NEW.amount AS CHAR));
    END IF;
END;