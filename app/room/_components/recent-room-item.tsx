import { cn } from '@/lib/utils'
import { ArrowRight, Pause } from 'lucide-react'

function RecentRoomItem({ room }: any) {
  return (
    <button
      key={room.id}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-secondary/40 transition-colors text-left group"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-foreground text-sm font-medium truncate">
            {room.name}
          </span>
          <span
            className={cn(
              "flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0",
              room.isLive
                ? "bg-emerald-400/10 text-emerald-400"
                : "bg-amber-400/10 text-amber-400"
            )}
          >
            {room.isLive ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
                Live
              </>
            ) : (
              <>
                <Pause className="h-2.5 w-2.5" />
                Paused
              </>
            )}
          </span>
        </div>
        <span className="text-muted-foreground text-xs">
          {[].length} watching
        </span>
      </div>
      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
    </button>
  )
}

export default RecentRoomItem