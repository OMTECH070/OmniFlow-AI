import React from "react";

export default function ChatMessage({ role, text }: { role: string; text: string }) {
	const isAssistant = role === "assistant";
	return (
		<div className={`mb-4 ${isAssistant ? "text-left" : "text-right"}`}>
			<div className={`inline-block max-w-[70%] p-4 rounded-lg ${isAssistant ? "bg-white/6" : "bg-[var(--accent)] text-white"}`}>
				{text.split('\n').map((line, i) => (
					<p key={i} className="text-sm leading-6">{line}</p>
				))}
			</div>
		</div>
	);
}

