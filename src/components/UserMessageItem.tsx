import { Avatar } from '@mantine/core'
import { useConfig } from '../context/config-context'
import type { WidgetConfig } from '../services/widget.service'

export default function UserMessageItem() {
  const { config = {} as WidgetConfig } = useConfig()

  return (
    <div className="flex flex-row-reverse gap-2">
      {config.avatarUrl ? null : <Avatar color="primary" size={28} />}

      <div className="bg-primary text-primary-foreground font-medium p-2 text-sm max-w-[75%] rounded-lg shadow-lg">
        Tôi có thể biết thời tiết hôm nay không?
      </div>
    </div>
  )
}
