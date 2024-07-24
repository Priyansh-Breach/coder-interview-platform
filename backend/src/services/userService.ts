import { connectRedis } from "../Database/redisDb";
import { Response } from "express";

/**
 * Get-user-by-id function
 */
export const getUserById = async (id: string, res: Response) => {
  const userJson = await connectRedis.get(id);
  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(201).json({
      success: true,
      user,
    });
  }
};