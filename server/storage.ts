import { 
  users, 
  type User, 
  type InsertUser, 
  type ErrorCode, 
  type RepairStep, 
  type ErrorWithSteps,
  type VideoTutorial,
  type InsertVideoTutorial,
  type ErrorCodeVideoLink,
  type InsertErrorCodeVideoLink
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
  
  // Video tutorial methods
  addVideoTutorial(tutorial: Omit<VideoTutorial, "id">): Promise<VideoTutorial>;
  getVideoTutorialById(id: number): Promise<VideoTutorial | undefined>;
  getAllVideoTutorials(): Promise<VideoTutorial[]>;
  getVideoTutorialsByCategory(categoryId: number): Promise<VideoTutorial[]>;
  searchVideoTutorials(query: string): Promise<VideoTutorial[]>;
  
  // Error code video link methods
  addErrorCodeVideoLink(link: Omit<ErrorCodeVideoLink, "id">): Promise<ErrorCodeVideoLink>;
  getVideoTutorialsByErrorCodeId(errorCodeId: number): Promise<VideoTutorial[]>;
  
  // Advanced queries
  getErrorWithSteps(errorCodeId: number): Promise<ErrorWithSteps | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private errorCodes: Map<number, ErrorCode>;
  private repairSteps: Map<number, RepairStep>;
  private videoTutorials: Map<number, VideoTutorial>;
  private errorCodeVideoLinks: Map<number, ErrorCodeVideoLink>;
  private userIdCounter: number;
  private errorCodeIdCounter: number;
  private repairStepIdCounter: number;
  private videoTutorialIdCounter: number;
  private errorCodeVideoLinkIdCounter: number;

  constructor() {
    this.users = new Map();
    this.errorCodes = new Map();
    this.repairSteps = new Map();
    this.videoTutorials = new Map();
    this.errorCodeVideoLinks = new Map();
    this.userIdCounter = 1;
    this.errorCodeIdCounter = 1;
    this.repairStepIdCounter = 1;
    this.videoTutorialIdCounter = 1;
    this.errorCodeVideoLinkIdCounter = 1;
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
  
  // Video tutorial methods
  async addVideoTutorial(tutorial: Omit<VideoTutorial, "id">): Promise<VideoTutorial> {
    const id = this.videoTutorialIdCounter++;
    const newTutorial: VideoTutorial = { ...tutorial, id };
    this.videoTutorials.set(id, newTutorial);
    return newTutorial;
  }
  
  async getVideoTutorialById(id: number): Promise<VideoTutorial | undefined> {
    return this.videoTutorials.get(id);
  }
  
  async getAllVideoTutorials(): Promise<VideoTutorial[]> {
    return Array.from(this.videoTutorials.values());
  }
  
  async getVideoTutorialsByCategory(categoryId: number): Promise<VideoTutorial[]> {
    return Array.from(this.videoTutorials.values()).filter(
      (tutorial) => tutorial.categoryId === categoryId
    );
  }
  
  async searchVideoTutorials(query: string): Promise<VideoTutorial[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.videoTutorials.values()).filter(
      (tutorial) => 
        tutorial.title.toLowerCase().includes(lowerQuery) ||
        tutorial.description.toLowerCase().includes(lowerQuery)
    );
  }
  
  // Error code video link methods
  async addErrorCodeVideoLink(link: Omit<ErrorCodeVideoLink, "id">): Promise<ErrorCodeVideoLink> {
    const id = this.errorCodeVideoLinkIdCounter++;
    const newLink: ErrorCodeVideoLink = { ...link, id };
    this.errorCodeVideoLinks.set(id, newLink);
    return newLink;
  }
  
  async getVideoTutorialsByErrorCodeId(errorCodeId: number): Promise<VideoTutorial[]> {
    // Find all links for this error code
    const links = Array.from(this.errorCodeVideoLinks.values())
      .filter((link) => link.errorCodeId === errorCodeId);
    
    // Get the video tutorials for these links
    const tutorials = links.map((link) => 
      this.videoTutorials.get(link.videoTutorialId)
    ).filter((tutorial): tutorial is VideoTutorial => tutorial !== undefined);
    
    return tutorials;
  }
  
  // Advanced queries
  async getErrorWithSteps(errorCodeId: number): Promise<ErrorWithSteps | undefined> {
    const errorCode = await this.getErrorCodeById(errorCodeId);
    
    if (!errorCode) {
      return undefined;
    }
    
    const steps = await this.getRepairStepsByErrorCodeId(errorCodeId);
    const videoTutorials = await this.getVideoTutorialsByErrorCodeId(errorCodeId);
    
    return {
      ...errorCode,
      steps,
      videoTutorials
    };
  }
}

export const storage = new MemStorage();
