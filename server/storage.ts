import { 
  users, 
  type User, 
  type InsertUser, 
  type ErrorCode, 
  type RepairStep, 
  type ErrorWithSteps
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Error code methods
  addErrorCode(errorCode: Omit<ErrorCode, "id">): Promise<ErrorCode>;
  getAllErrorCodes(): Promise<ErrorCode[]>;
  getErrorCodeById(id: number): Promise<ErrorCode | undefined>;
  getErrorCodeByCode(code: string): Promise<ErrorCode | undefined>;
  getErrorCodesByType(type: string): Promise<ErrorCode[]>;
  searchErrorCodes(query: string): Promise<ErrorCode[]>;
  
  // Repair step methods
  addRepairStep(step: Omit<RepairStep, "id">): Promise<RepairStep>;
  getRepairStepById(id: number): Promise<RepairStep | undefined>;
  getRepairStepsByErrorCodeId(errorCodeId: number): Promise<RepairStep[]>;
  
  // Advanced queries
  getErrorWithSteps(errorCodeId: number): Promise<ErrorWithSteps | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private errorCodes: Map<number, ErrorCode>;
  private repairSteps: Map<number, RepairStep>;
  private userIdCounter: number;
  private errorCodeIdCounter: number;
  private repairStepIdCounter: number;

  constructor() {
    this.users = new Map();
    this.errorCodes = new Map();
    this.repairSteps = new Map();
    this.userIdCounter = 1;
    this.errorCodeIdCounter = 1;
    this.repairStepIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Error code methods
  async addErrorCode(errorCode: Omit<ErrorCode, "id">): Promise<ErrorCode> {
    const id = this.errorCodeIdCounter++;
    const newErrorCode: ErrorCode = { ...errorCode, id };
    this.errorCodes.set(id, newErrorCode);
    return newErrorCode;
  }
  
  async getAllErrorCodes(): Promise<ErrorCode[]> {
    return Array.from(this.errorCodes.values());
  }
  
  async getErrorCodeById(id: number): Promise<ErrorCode | undefined> {
    return this.errorCodes.get(id);
  }
  
  async getErrorCodeByCode(code: string): Promise<ErrorCode | undefined> {
    return Array.from(this.errorCodes.values()).find(
      (errorCode) => errorCode.code === code
    );
  }
  
  async getErrorCodesByType(type: string): Promise<ErrorCode[]> {
    return Array.from(this.errorCodes.values()).filter(
      (errorCode) => errorCode.errorType === type
    );
  }
  
  async searchErrorCodes(query: string): Promise<ErrorCode[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.errorCodes.values()).filter(
      (errorCode) => 
        errorCode.code.toLowerCase().includes(lowerQuery) ||
        errorCode.description.toLowerCase().includes(lowerQuery) ||
        (errorCode.cause && errorCode.cause.toLowerCase().includes(lowerQuery))
    );
  }
  
  // Repair step methods
  async addRepairStep(step: Omit<RepairStep, "id">): Promise<RepairStep> {
    const id = this.repairStepIdCounter++;
    const newStep: RepairStep = { ...step, id };
    this.repairSteps.set(id, newStep);
    return newStep;
  }
  
  async getRepairStepById(id: number): Promise<RepairStep | undefined> {
    return this.repairSteps.get(id);
  }
  
  async getRepairStepsByErrorCodeId(errorCodeId: number): Promise<RepairStep[]> {
    return Array.from(this.repairSteps.values()).filter(
      (step) => step.errorCodeId === errorCodeId
    );
  }
  
  // Advanced queries
  async getErrorWithSteps(errorCodeId: number): Promise<ErrorWithSteps | undefined> {
    const errorCode = await this.getErrorCodeById(errorCodeId);
    
    if (!errorCode) {
      return undefined;
    }
    
    const steps = await this.getRepairStepsByErrorCodeId(errorCodeId);
    
    return {
      ...errorCode,
      steps
    };
  }
}

export const storage = new MemStorage();
