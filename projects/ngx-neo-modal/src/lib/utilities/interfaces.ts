import { InjectionToken } from "@angular/core";

 export interface BodyScrollOptions {
    reserveScrollBarGap?: boolean;
    allowTouchMove?: (el: any) => boolean;
    target?: string;
  }

  export interface Lock {
    targetElement: any;
    options: BodyScrollOptions;
  }

 export type HandleScrollEvent = TouchEvent;
 export const SCROLL_CONFIG = new InjectionToken<BodyScrollOptions>('scroll.config');
