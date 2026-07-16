(function(){})();
import React from "react";
import ChatHistory from "./ChatHistory";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

export default function ChatBox() {
	const messages = [
		{ id: 1, role: "assistant", text: "Say hello to get started\nThis workspace runs on mock responses — perfect for building the UI." },
	];

	return (
		<div className="h-full flex flex-col bg-transparent">
			<header className="flex items-center justify-between border-b border-white/6 pb-4 mb-4">
				<div>
					<h2 className="text-lg font-semibold">New conversation</h2>
					<div className="text-xs text-[var(--muted)]">Mock assistant · frontend demo</div>
				</div>
				<div className="text-sm text-[var(--muted)]">AK</div>
			</header>

			<div className="flex gap-6 h-full">
				<div className="w-80 bg-transparent">
					<ChatHistory />
				</div>

				<div className="flex-1 flex flex-col">
					<div className="flex-1 overflow-y-auto p-6 scrollbar-hide rounded-lg">
						{messages.map((m) => (
							<ChatMessage key={m.id} role={m.role} text={m.text} />
						))}
					</div>

					<div className="mt-4">
						<ChatInput />
					</div>
				</div>
			</div>
		</div>
	);
}

