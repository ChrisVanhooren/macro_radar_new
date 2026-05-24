interface BriefHeaderProps {
  headline: string
  oneLine: string
  date: string
}

export default function BriefHeader({ headline, oneLine, date }: BriefHeaderProps) {
  const formatted = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="mb-12 pb-8" style={{ borderBottom: '1px solid var(--border)' }}>
      <p
        className="text-xs tracking-[0.3em] uppercase mb-6"
        style={{ color: 'var(--text-muted)' }}
      >
        {formatted}
      </p>

      <h1
        className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6"
        style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}
      >
        {headline}
      </h1>

      <p
        className="text-base md:text-lg leading-relaxed italic"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-playfair)' }}
      >
        {oneLine}
      </p>
    </header>
  )
}
