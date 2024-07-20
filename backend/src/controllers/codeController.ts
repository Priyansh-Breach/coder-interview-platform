// src/controllers/codeController.ts
import { Request, Response } from "express";
import { exec } from "child_process";
import { promises as fs } from "fs";
import util from "util";

const execPromise = util.promisify(exec);

export const compileCode = async (req: Request, res: Response) => {
  console.log(req.body);
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: "Code is required" });
  }

  try {
    // Save the code to a temporary file
    const tempFilePath = "temp_code.js";
    await fs.writeFile(tempFilePath, code);

    // Execute the code
    const { stdout, stderr } = await execPromise(`node ${tempFilePath}`);
    await fs.unlink(tempFilePath); // Clean up the temp file

    if (stderr) {
      return res.status(400).json({ output: stderr });
    }

    res.json({ output: stdout });
  } catch (error) {
    console.error("Error executing code:", error);
    res.status(500).json({ message: "Error executing code" });
  }
};
