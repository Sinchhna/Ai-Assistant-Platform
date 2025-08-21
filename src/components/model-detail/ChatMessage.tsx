
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Brain } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isRealAI?: boolean;
  modelName?: string;
}

interface ChatMessageProps {
  message: Message;
  getCategoryIcon: () => JSX.Element;
}

const ChatMessage = ({ message, getCategoryIcon }: ChatMessageProps) => {
  // Very small Markdown subset renderer to support fenced code blocks
  const renderContent = (text: string) => {
    const segments: Array<{ type: 'text' | 'code'; lang?: string; content: string }> = [];
    const fenceRegex = /```([\w+-]*)\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = fenceRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ type: 'text', content: text.slice(lastIndex, match.index) });
      }
      segments.push({ type: 'code', lang: match[1] || undefined, content: match[2] });
      lastIndex = fenceRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      segments.push({ type: 'text', content: text.slice(lastIndex) });
    }

    return (
      <div className="space-y-3">
        {segments.map((seg, idx) => {
          if (seg.type === 'code') {
            return (
              <pre key={idx} className="w-full overflow-x-auto rounded bg-muted p-3 text-sm">
                <code className="font-mono whitespace-pre">{seg.content}</code>
              </pre>
            );
          }
          // Text: preserve line breaks
          return (
            <div key={idx} className="whitespace-pre-wrap">
              {seg.content}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`flex gap-3 ${
        message.role === 'assistant' ? 'justify-start' : 'justify-end'
      }`}
    >
      {message.role === 'assistant' && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary/10 text-primary">
            {getCategoryIcon()}
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={`rounded-lg px-4 py-2 max-w-[80%] ${
          message.role === 'assistant'
            ? 'bg-secondary text-secondary-foreground'
            : 'bg-primary text-primary-foreground'
        }`}
      >
        {renderContent(message.content)}
      </div>
      {message.role === 'user' && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary text-primary-foreground">
            U
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
