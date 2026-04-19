interface WipLimitBadgeProps {
  count: number
  limit: number | null
}

export function WipLimitBadge({ count, limit }: WipLimitBadgeProps) {
  if (!limit) return null
  const exceeded = count > limit

  return (
    <span
      className="text-[10px] font-semibold tabular-nums px-1.5 py-0.5 rounded-full"
      style={
        exceeded
          ? { color: "#d44c47", background: "rgba(212,76,71,0.08)", border: "1px solid rgba(212,76,71,0.25)" }
          : { color: "#a39e98", background: "transparent", border: "1px solid rgba(0,0,0,0.1)" }
      }
    >
      {count}/{limit}
    </span>
  )
}
