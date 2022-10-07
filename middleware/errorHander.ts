import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { logEvent } from "./logger";



export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logEvent(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
  console.log(err.stack)

  const status = res.statusCode ? res.statusCode : 500

  res.status(status)

  res.json({ message: err.message })
}