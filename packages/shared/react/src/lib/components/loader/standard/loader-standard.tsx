import { cn } from '../../../utils/class-names';
import { SmartLoaderProps } from '../loader.types';
import { useLoader } from '../use-loader';

/** The default loader rendering (`<smart-loader-standard>`): an SVG spinner. */
export function SmartLoaderStandard(props: SmartLoaderProps) {
  const { show = false } = props;
  const { spinnerClasses } = useLoader(props);

  if (!show) return null;

  return (
    <svg
      className={cn(spinnerClasses)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label="loading"
    >
      <circle
        className="smart:opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="smart:opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
