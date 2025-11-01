import Link from 'next/link'

export type IconProps = React.HTMLAttributes<SVGElement> & { width?: number, height?: number }

export const HeaderLogo2 = ({
  className,
}: { className?: string }) => {
  return (
    <div className={`flex flex-col items-start justify-center w-50 ${className}`}>
      <div className="flex flex-row items-baseline">
        <div className="text-xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
          Dinamik
        </div>
        <div className="text-xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tighter">
          SAYO
        </div>
      </div>
      <div className="text-[0.65rem] md:text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wider mt-0.5 md:mt-1">
        Sağlam, bükülmez ve hızlı
      </div>
    </div>
  )
}