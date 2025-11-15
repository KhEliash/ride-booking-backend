import { Response } from "express";

export const setCookie = (res: Response, tokenInfo: string) => {
  if (tokenInfo) {
    res.cookie("accessToken", tokenInfo, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  }
};
