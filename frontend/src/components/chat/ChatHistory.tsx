import React from "react";

export default function ChatHistory() {
	const items = [
		{ id: 1, title: "New conversation", subtitle: "No messages yet" },
		{ id: 2, title: "Refactor the auth middleware", subtitle: "Sure — the cleanest way is to wrap th..." },
		{ id: 3, title: "Weekly report summary ideas", subtitle: "No messages yet" },
	];

	return (
		<div className="bg-transparent">
			<div className="text-xs text-[var(--muted)] mb-2">RECENT</div>
			<ul className="space-y-3">
				{items.map((it) => (
					<li key={it.id} className="p-3 rounded hover:bg-white/3">
						<div className="font-medium">{it.title}</div>
						<div className="text-xs text-[var(--muted)]">{it.subtitle}</div>
					</li>
				))}
			</ul>
		</div>
}
