-- tabela principal
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

-- tabela de auditoria
CREATE TABLE `transactions_audit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transactionId` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `oldAmount` FLOAT NULL,
    `newAmount` FLOAT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- TRIGGER 
DROP TRIGGER IF EXISTS after_transaction_insert;
CREATE TRIGGER after_transaction_insert
AFTER INSERT ON transactions
FOR EACH ROW
BEGIN
    INSERT INTO transactions_audit (transactionId, action, newAmount, createdAt)
    VALUES (NEW.id, 'INSERT', NEW.amount, NOW());
END;

-- STORED PROCEDURE
DROP PROCEDURE IF EXISTS CalculateCategoryTotal;
CREATE PROCEDURE CalculateCategoryTotal(IN p_category VARCHAR(255), OUT p_total FLOAT)
BEGIN
    SELECT IFNULL(SUM(amount), 0) INTO p_total
    FROM transactions
    WHERE category COLLATE utf8mb4_unicode_ci = p_category COLLATE utf8mb4_unicode_ci;
END;
