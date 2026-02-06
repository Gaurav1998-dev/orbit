import { Client, type ClientConfig } from "@xdevplatform/xdk";

const config: ClientConfig = { bearerToken: process.env.TWITTER_BEARER_TOKEN };
export const xClient = new Client(config);

export async function verifyXUsername(xUsername: string) {
  const xUserResponse = await xClient.users.getByUsername(xUsername);
  
  if (!xUserResponse.data?.id) {
    return undefined;
  }
  
  return xUserResponse;
}