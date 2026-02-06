import { Client, type ClientConfig } from "@xdevplatform/xdk";

const config: ClientConfig = { bearerToken: process.env.TWITTER_BEARER_TOKEN };
export const xClient = new Client(config);

/** Response shape from X API GET /2/users/by/username/{username} */
type XApiUserResponse = {
  data?: {
    id: string;
    url?: string;
    profile_image_url?: string;
    description?: string;
    created_at?: string;
  };
  errors?: Array<{ message: string }>;
};

export async function verifyXUsername(xUsername: string) {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  if (!bearerToken) return undefined;

  const url = new URL(
    `https://api.x.com/2/users/by/username/${encodeURIComponent(xUsername)}`
  );
  url.searchParams.set(
    "user.fields",
    "created_at,description,id,profile_image_url,url"
  );

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${bearerToken}` },
  });
  const json = (await res.json()) as XApiUserResponse;

  if (!res.ok || !json.data?.id) {
    return undefined;
  }

  return json.data;
}