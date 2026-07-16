import React from "react";

export default function ChatInput() {
	return (
		<div className="bg-[rgba(255,255,255,0.02)] p-3 rounded-lg">
			<div className="flex items-center gap-3">
				<input
					className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[var(--muted)]"
					placeholder="Message OmniFlow..."
				/>
				<button className="h-10 w-10 rounded bg-[var(--accent)] text-white flex items-center justify-center">↑</button>
			</div>
			<div className="text-xs text-[var(--muted)] mt-2">Enter to send · Shift + Enter for a new line</div>
		</div>
	);
}
