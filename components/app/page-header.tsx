/** Fixed header row for single-pane pages (Domains, Settings). */
export function PageHeader({
  title,
  count,
  description,
  actions,
}: {
  title: string;
  count?: number;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex shrink-0 flex-col gap-1 border-b bg-card px-4 pt-4 pb-3 lg:bg-transparent lg:px-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl leading-none">
          {title}
          {count !== undefined && (
            <span className="ml-2 text-base text-muted-foreground tabular-nums">
              {count}
            </span>
          )}
        </h1>
        {actions}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </header>
  );
}
