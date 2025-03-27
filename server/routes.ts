import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { parseErrorCodes } from "./services/errorCodeParser";

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize error codes data from CSV file
  const csvFilePath = path.resolve(__dirname, "../attached_assets/副本桩端故障码统计说明.csv");
  
  try {
    if (fs.existsSync(csvFilePath)) {
      const errorCodes = await parseErrorCodes(csvFilePath);
      
      // Initialize storage with error codes
      for (const errorCode of errorCodes) {
        const savedErrorCode = await storage.addErrorCode(errorCode);
        
        // Add some sample repair steps for the most common errors
        if (errorCode.code === '3009') {
          await storage.addRepairStep({
            errorCodeId: savedErrorCode.id,
            stepNumber: 1,
            title: "检查环境温度",
            description: "确认充电站环境温度是否在正常范围内（-20°C 至 50°C）。如果环境温度过高，需要进行降温处理。",
            notes: null
          });
          
          await storage.addRepairStep({
            errorCodeId: savedErrorCode.id,
            stepNumber: 2,
            title: "检查充电枪温度传感器",
            description: "使用温度检测器测量充电枪实际温度，并与系统显示温度进行比对。若差异过大，可能是温度传感器故障。",
            notes: null
          });
          
          await storage.addRepairStep({
            errorCodeId: savedErrorCode.id,
            stepNumber: 3,
            title: "检查冷却系统",
            description: "检查充电桩冷却系统是否正常工作，包括风扇运转状态、冷却风道是否畅通、散热片是否积尘等。",
            notes: null
          });
          
          await storage.addRepairStep({
            errorCodeId: savedErrorCode.id,
            stepNumber: 4,
            title: "检查充电电流",
            description: "验证充电过程中的电流是否超出额定值。如果持续大电流充电可能导致过温，需调整充电策略。",
            notes: "充电电流不应超过充电桩额定输出电流的95%进行长时间工作。"
          });
          
          await storage.addRepairStep({
            errorCodeId: savedErrorCode.id,
            stepNumber: 5,
            title: "更换组件",
            description: "如果以上检查后仍无法解决问题，可能需要更换温度传感器或充电枪组件。",
            notes: null
          });
        }
      }
      
      console.log(`Loaded ${errorCodes.length} error codes from CSV`);
    } else {
      console.error(`CSV file not found at ${csvFilePath}`);
    }
  } catch (error) {
    console.error('Error loading CSV file:', error);
  }

  // API Routes
  app.get('/api/errors', async (req, res) => {
    try {
      const errors = await storage.getAllErrorCodes();
      res.json(errors);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve error codes' });
    }
  });
  
  app.get('/api/errors/:code', async (req, res) => {
    try {
      const { code } = req.params;
      const error = await storage.getErrorCodeByCode(code);
      
      if (!error) {
        return res.status(404).json({ message: 'Error code not found' });
      }
      
      // Get repair steps if available
      const steps = await storage.getRepairStepsByErrorCodeId(error.id);
      
      res.json({
        ...error,
        steps
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve error code details' });
    }
  });
  
  app.get('/api/errors/type/:type', async (req, res) => {
    try {
      const { type } = req.params;
      let errors;
      
      if (type === 'all') {
        errors = await storage.getAllErrorCodes();
      } else {
        errors = await storage.getErrorCodesByType(type);
      }
      
      res.json(errors);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve error codes by type' });
    }
  });

  app.get('/api/search', async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: 'Search query required' });
      }
      
      const results = await storage.searchErrorCodes(q);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: 'Search failed' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
