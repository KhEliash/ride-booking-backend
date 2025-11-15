import { Response } from "express";

export const setCookie = (res: Response, tokenInfo: string) => {
  if (tokenInfo) {
    res.cookie("accessToken", tokenInfo, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",  
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
};
