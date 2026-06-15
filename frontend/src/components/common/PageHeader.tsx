// Usage:
// <PageHeader title="로그인" />
// <PageHeader title="회원가입" onBack={() => navigate(-1)} />
// <PageHeader title="메인화면" showBack={false} />

interface PageHeaderProps {
  title: string
  onBack?: () => void
  showBack?: boolean
}

export default function PageHeader({ title, onBack, showBack = true }: PageHeaderProps) {
  const handleBack = onBack ?? (() => window.history.back())

  return (
    <header className="relative flex items-center h-[72px] px-6 border-b border-neutral-90 bg-white">
      {showBack && (
        <button
          type="button"
          onClick={handleBack}
          className="absolute left-6 flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral-100 active:bg-neutral-90 transition-colors"
          aria-label="뒤로가기"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}
      <h1 className="w-full text-center text-[28px] font-bold text-neutral-10">
        {title}
      </h1>
    </header>
  )
}
