import { createUserSubscription } from "@/server/db/subscription";
import { deleteUser } from "@/server/db/users";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
  const headerPayload = headers();
  const svixId = (await headerPayload).get("svix-id");
  const svixTimestamp = (await headerPayload).get("svix-timestamp");
  const svixSignature = (await headerPayload).get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  console.error("ERROR OCCURRED");

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  switch (event.type) {
    case "user.created": {
      console.log("user created");
      await createUserSubscription({
        clerkUserId: event.data.id,
        tier: "Free",
      });
      break;
    }
    case "user.deleted": {
      console.log("user deleted");

      if (event.data.id != null) {
        await deleteUser(event.data.id);
      }

      break;
    }
  }

  return new Response("", { status: 200 });
}
