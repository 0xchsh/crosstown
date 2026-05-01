'use client';

import { useState } from 'react';
import { Copy, Check } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

export function CopyableCode({
  value,
  terminal = false,
}: {
  value: string;
  terminal?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard may be denied; fail silently */
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-2">
      <span className="flex-1 overflow-x-auto font-mono text-[13px] whitespace-nowrap">
        {terminal && (
          <span className="mr-2 text-muted-foreground select-none">$</span>
        )}
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onCopy}
        aria-label={copied ? 'Copied' : 'Copy to clipboard'}
      >
        {copied ? (
          <Check weight="regular" />
        ) : (
          <Copy weight="regular" />
        )}
      </Button>
    </div>
  );
}
