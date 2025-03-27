import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const errorCodes = pgTable("error_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  description: text("description").notNull(),
  errorType: text("error_type").notNull(),
  cause: text("cause"),
  solution: text("solution"),
});

export const repairSteps = pgTable("repair_steps", {
  id: serial("id").primaryKey(),
  errorCodeId: integer("error_code_id").notNull(),
  stepNumber: integer("step_number").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  notes: text("notes"),
});

// Schema Validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertErrorCodeSchema = createInsertSchema(errorCodes).omit({
  id: true,
});

export const insertRepairStepSchema = createInsertSchema(repairSteps).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertErrorCode = z.infer<typeof insertErrorCodeSchema>;
export type ErrorCode = typeof errorCodes.$inferSelect;

export type InsertRepairStep = z.infer<typeof insertRepairStepSchema>;
export type RepairStep = typeof repairSteps.$inferSelect;

// Additional Types for API
export type ErrorWithSteps = ErrorCode & {
  steps?: RepairStep[];
};
