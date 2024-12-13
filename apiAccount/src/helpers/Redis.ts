import crypto from "crypto";
import Redis from "ioredis";
import { AppError } from "../errors/ErrorHandling";

// Create Redis client instance
export const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  //LOCALMODE
  //port: parseInt(process.env.REDIS_PORT),
  connectTimeout: 5000, // 5 seconds
});

export async function set(jwtToken: string, expiresIn: number) {
  try {
    // Split the token into signature and head/body parts
    const [header, payload, signature] = jwtToken.split(".");

    // Hash the signature
    const hashedSignature = crypto
      .createHash("sha256")
      .update(signature)
      .digest("hex");

    // Cache the head and body parts of the JWT in Redis
    await redisClient.set(hashedSignature, jwtToken, "EX", expiresIn);

    return signature;
  } catch (error) {
    throw new AppError({ statusCode: 401 });
  }
}

export async function get(signature: string) {
  try {
    const hashedSignature = crypto
      .createHash("sha256")
      .update(signature)
      .digest("hex");

    const cache = await redisClient.get(hashedSignature);

    return cache;
  } catch (error) {
    throw new AppError({ statusCode: 401 });
  }
}

export async function del(signature: string) {
  try {
    if (typeof signature !== "string") {
      const hashedSignature = crypto
        .createHash("sha256")
        .update(signature)
        .digest("hex");

      await redisClient.del(hashedSignature);
    }
  } catch (error) {
    throw new AppError({ statusCode: 401 });
  }
}
