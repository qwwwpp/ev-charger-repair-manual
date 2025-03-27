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

  // Add sample video tutorials
  // This would normally come from a database, but for this example we'll add some sample data
  const addSampleVideoTutorials = async () => {
    // Create sample videos
    const video1 = await storage.addVideoTutorial({
      title: "充电枪过温故障维修指南",
      description: "详细演示如何诊断和修复充电枪过温故障的完整流程。",
      url: "https://example.com/videos/charger-overtemp-repair.mp4",
      thumbnailUrl: "https://example.com/thumbnails/charger-overtemp.jpg",
      duration: "8:45",
      categoryId: 1
    });
    
    const video2 = await storage.addVideoTutorial({
      title: "通信中断故障排除",
      description: "本视频展示如何解决充电桩与车辆间通信中断的问题",
      url: "https://example.com/videos/comm-interruption.mp4",
      thumbnailUrl: "https://example.com/thumbnails/comm-interruption.jpg",
      duration: "12:20",
      categoryId: 2
    });
    
    const video3 = await storage.addVideoTutorial({
      title: "充电接口清洁与维护",
      description: "定期维护充电接口的正确方法，避免接触不良故障",
      url: "https://example.com/videos/connector-maintenance.mp4",
      thumbnailUrl: "https://example.com/thumbnails/connector-maintenance.jpg",
      duration: "5:15",
      categoryId: 3
    });
    
    // Link videos to error codes
    // Find the error codes by their code values
    const errorCode3009 = await storage.getErrorCodeByCode("3009");
    const errorCode4002 = await storage.getErrorCodeByCode("4002");
    const errorCode5001 = await storage.getErrorCodeByCode("5001");
    
    if (errorCode3009) {
      await storage.addErrorCodeVideoLink({
        errorCodeId: errorCode3009.id,
        videoTutorialId: video1.id
      });
    }
    
    if (errorCode4002) {
      await storage.addErrorCodeVideoLink({
        errorCodeId: errorCode4002.id,
        videoTutorialId: video2.id
      });
    }
    
    if (errorCode5001) {
      await storage.addErrorCodeVideoLink({
        errorCodeId: errorCode5001.id,
        videoTutorialId: video3.id
      });
    }
    
    console.log('Added sample video tutorials');
  };
  
  // Call the function to add sample data
  await addSampleVideoTutorials();

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
      
      // Get complete error info with steps and videos
      const errorWithDetails = await storage.getErrorWithSteps(error.id);
      
      res.json(errorWithDetails);
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
  
  // Video tutorial endpoints
  app.get('/api/videos', async (req, res) => {
    try {
      const videos = await storage.getAllVideoTutorials();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve video tutorials' });
    }
  });
  
  app.get('/api/videos/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const video = await storage.getVideoTutorialById(id);
      
      if (!video) {
        return res.status(404).json({ message: 'Video tutorial not found' });
      }
      
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve video tutorial' });
    }
  });
  
  app.get('/api/videos/search', async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: 'Search query required' });
      }
      
      const results = await storage.searchVideoTutorials(q);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: 'Video search failed' });
    }
  });
  
  app.get('/api/errors/:errorId/videos', async (req, res) => {
    try {
      const errorId = parseInt(req.params.errorId);
      const videos = await storage.getVideoTutorialsByErrorCodeId(errorId);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve videos for error code' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
