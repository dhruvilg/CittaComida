import * as webpush from "web-push";
import { chatBackend } from "./chat-backend";

type Sub = { endpoint: string; phone: string; sub: webpush.PushSubscription };

function configured() {
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) return false;
  webpush.setVapidDetails("mailto:hello@cittacomida.com", pub, priv);
  return true;
}

/** Nudge everyone except `sender`. Payload is deliberately generic. */
export async function notifyOthers(sender: string) {
  if (!configured()) return;
  const r = await chatBackend<{ subs: Sub[] }>({ action: "subs", sender });
  if (!r.ok || !r.data.subs?.length) return;

  const payload = JSON.stringify({
    title: "Citta Comida",
    body: "Something fresh just came out of the oven 🍪",
    url: "/c",
    tag: "cc-fresh",
  });
  const dead: string[] = [];
  await Promise.all(
    r.data.subs.map(async (s) => {
      try {
        await webpush.sendNotification(s.sub, payload, { TTL: 60 * 60 * 12, urgency: "high" });
      } catch (e: unknown) {
        const code = (e as { statusCode?: number }).statusCode;
        if (code === 404 || code === 410) dead.push(s.endpoint);
      }
    })
  );
  if (dead.length) await chatBackend({ action: "prune", endpoints: dead });
}
