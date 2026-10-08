import { IProgressBarsOptions } from '../../models';

export interface IProgressStepClick {
  stepId: string;
}

export interface SmartProgressBarsProps {
  options?: IProgressBarsOptions;
  className?: string;
  /** A click on a step without `href`. */
  onStepClick?: (event: IProgressStepClick) => void;
}
