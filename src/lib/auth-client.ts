import { createAuthClient } from "better-auth/react";
import type { useRouter } from "next/navigation";

type Router = ReturnType<typeof useRouter>;

export const authClient = createAuthClient();

export const signIn = async () => {
  await authClient.signIn.social({
    provider: "twitter",
    callbackURL: "/dashboard",
  });
};

export const signOut = async (router: Router) => {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        router.push("/");
      },
    },
  });
};
