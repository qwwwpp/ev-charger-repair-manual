import fs from 'fs';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import { ErrorCode } from '@shared/schema';

interface CSVErrorCode {
  code: string;
  description: string;
  errorType: string;
  cause: string;
}

export async function parseErrorCodes(filePath: string): Promise<Omit<ErrorCode, 'id'>[]> {
  const errorCodes: Omit<ErrorCode, 'id'>[] = [];
  const processedCodes = new Set<string>(); // To avoid duplicates
  
  const fileStream = createReadStream(filePath);
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  let lineNumber = 0;
  
  for await (const line of rl) {
    lineNumber++;
    
    // Skip header
    if (lineNumber === 1) {
      continue;
    }
    
    // Clean and parse CSV line
    const columns = line.split(',');
    
    // Skip empty lines
    if (!columns[0].trim()) {
      continue;
    }
    
    // Extract data from the row
    // Format: code, description, errorType, cause
    const leftSide = {
      code: columns[0].trim(),
      description: columns[1].trim(),
      errorType: columns[2].trim(),
      cause: columns[3].trim() || ''
    };
    
    // There's also data on the right side of the CSV (桩端上报故障码 section)
    const rightSide = {
      code: columns[7].trim(),
      description: columns[8].trim(),
      errorType: columns[9].trim(),
      cause: columns[10].trim() || ''
    };
    
    // Add left side data if valid
    if (leftSide.code && leftSide.description && !processedCodes.has(leftSide.code)) {
      errorCodes.push({
        code: leftSide.code,
        description: leftSide.description,
        errorType: leftSide.errorType,
        cause: leftSide.cause,
        solution: ''
      });
      processedCodes.add(leftSide.code);
    }
    
    // Add right side data if valid
    if (rightSide.code && rightSide.description && !processedCodes.has(rightSide.code)) {
      errorCodes.push({
        code: rightSide.code,
        description: rightSide.description,
        errorType: rightSide.errorType,
        cause: rightSide.cause,
        solution: ''
      });
      processedCodes.add(rightSide.code);
    }
  }
  
  return errorCodes;
}
