interface WipLimitBadgeProps {
  count: number
  limit: number | null
}

export function WipLimitBadge({ count, limit }: WipLimitBadgeProps) {
  if (!limit) return null
  const exceeded = count > limit

  return (
    <span
      className={`text-xs font-mono tabular-nums px-1.5 py-0.5 rounded border ${
        exceeded
          ? "text-[oklch(0.65_0.2_25)] border-[oklch(0.65_0.2_25_/_30%)] bg-[oklch(0.65_0.2_25_/_8%)]"
          : "text-muted-foreground border-border bg-transparent"
      }`}
    >
      {count}/{limit}
    </span>
  )
}
