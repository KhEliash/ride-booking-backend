/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status-codes";

const createUser = (req: Request , res: Response)=>{
 try {
    // const {name, email}= req.body;
 } catch (error: any) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json({
        message: `Something Went Wrong!! ${error.message}`
    })
 }
}
