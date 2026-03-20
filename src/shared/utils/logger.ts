export function logMessage(filePath: string, message: string): void {
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
  console.log(`[${timestamp}] [${filePath}] ${message}`);
}
