CREATE TRIGGER `transactions_after_insert`
AFTER INSERT ON `transactions`
FOR EACH ROW
BEGIN
  INSERT INTO `transactions_audit` (
    `transactionId`,
    `action`,
    `oldAmount`,
    `newAmount`,
    `createdAt`
  ) VALUES (
    NEW.id,
    'insert',
    NULL,
    NEW.amount,
    NOW(3)
  );
END;
