// Usage:
// <RoleCard role="patient" label="환자" description="음성으로 안내를 듣고, 말로 답하며 매일 인지 자극 활동을 수행해요" icon={imgPatient} selected={role === 'patient'} onSelect={() => setRole('patient')} />

interface RoleCardProps {
  label: string
  description: string
  icon: string
  selected?: boolean
  onSelect?: () => void
}

export default function RoleCard({ label, description, icon, selected = false, onSelect }: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        'flex flex-col items-center gap-6 rounded-[15px] pt-[43px] pb-[42px] px-8 flex-1 min-w-[220px] max-w-[392px] transition-all cursor-pointer',
        selected
          ? 'bg-[rgba(65,136,237,0.05)] border border-secondary shadow-[0_0_8px_#2073e8]'
          : 'bg-neutral-100 shadow-[0_0_4px_#797980] hover:shadow-[0_0_8px_#4188ed]',
      ].join(' ')}
    >
      <img
        src={icon}
        alt={label}
        className={['h-[125px] object-contain transition-opacity', selected ? 'opacity-100' : 'opacity-80'].join(' ')}
      />
      <div className="text-center flex flex-col gap-3">
        <p className={['text-[36px] font-bold leading-snug', selected ? 'text-primary-dark' : 'text-neutral-10'].join(' ')}>
          {label}
        </p>
        <p className="text-neutral-gray text-[22px] leading-relaxed whitespace-pre-line">{description}</p>
      </div>
    </button>
  )
}
