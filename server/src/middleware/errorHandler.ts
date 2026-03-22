import { AppError } from "@/types/error";
import {Request, Response, NextFunction} from "express"


export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // 如果是操作性错误（我们主动抛出的），直接返回
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // 如果是编程错误或未知错误（比如数据库连接失败、代码 bug）
  console.error("💥 ERROR:", err); // 生产环境建议记录到日志系统

  // 生产环境不暴露详细错误信息
  const isProduction = process.env.NODE_ENV === "production";
  const message = isProduction ? "Something went wrong!" : err.message;

  res.status(err.statusCode || 500).json({
    status: "error",
    message,
    // 开发环境可附带 stack trace 便于调试
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

