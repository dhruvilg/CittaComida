import type { Metadata } from "next";
import { currentUser, ownerPhone } from "@/lib/chat-auth";
import ChatLogin from "@/components/ChatLogin";
import ChatRoom from "@/components/ChatRoom";

export const metadata: Metadata = {
  title: "Kitchen notes",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const me = await currentUser();
  if (!me) return <ChatLogin />;
  return <ChatRoom me={me} isOwner={me === ownerPhone()} />;
}
