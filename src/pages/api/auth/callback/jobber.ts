import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export default async function Jobber(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // https://api.getjobber.com/api/oauth/authorize?client_id=f738dd01-069b-4049-a94d-33fabc533306&scope=openid&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fjobber&state=yd9Y2NO_SunMYPtMJot5XZ9hEO0vgVsq_EI0Sj6PBOU

  if (!req.query.code || typeof req.query.code !== "string") {
    res.status(400).json({ error: "Missing code" });
  }
  const code = req.query.code as string;

  // decrypt code from b64
  const decryptedCode = Buffer.from(
    code?.split(".")?.[1] || "",
    "base64"
  ).toString("ascii");

  if (!decryptedCode) {
    res.status(400).json({ error: "Invalid code" });
  }

  const parsedCode = JSON.parse(decryptedCode) as unknown as {
    user_id: string | number;
    app_id: string;
    scopes: string;
    exp: number;
  };

  console.log({ parsedCode });

  const tokens = (await fetch(
    `https://api.getjobber.com/api/oauth/token?client_id=${"f738dd01-069b-4049-a94d-33fabc533306"}&client_secret=${`9aa9ba2fdf6ba193b8a339966d1ac55d66f6ebfe77cad91c04475c3561868786`}&grant_type=authorization_code&code=${code}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  ).then((res) => res.json())) as {
    access_token: string;
    refresh_token: string;
  };

  prisma.user
    .create({
      data: {
        accounts: {
          create: [
            {
              type: "oauth",
              provider: "jobber",
              providerAccountId: parsedCode.app_id,
              scope: parsedCode.scopes,
              access_token: tokens.access_token,
              refresh_token: tokens.refresh_token,
              id_token: String(parsedCode.user_id),
              expires_at: parsedCode.exp,
            },
          ],
        },
      },
    })
    .catch((e) => console.log(e));

  res.status(200).json({ message: "Success", tokens });
}
