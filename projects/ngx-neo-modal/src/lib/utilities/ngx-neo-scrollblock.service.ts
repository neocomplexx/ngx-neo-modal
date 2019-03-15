import { Injectable } from '@angular/core';
import { Lock, BodyScrollOptions, HandleScrollEvent } from './interfaces';

@Injectable()
export class NgxNeoScrollBlockService {

    private _window(): any {
        // return the global native browser this._window() object
        return window;
    }

    constructor() {
        if (typeof this._window() !== 'undefined') {
            const passiveTestOptions = {
                get passive() {
                    hasPassiveEvents = true;
                    return undefined;
                },
            };
            this._window().addEventListener('testPassive', null, passiveTestOptions);
            this._window().removeEventListener('testPassive', null, passiveTestOptions);
        }
    }

    private get isIosDevice() {
        return !(typeof this._window() !== 'undefined' &&
            this._window().navigator &&
            this._window().navigator.platform &&
            /iP(ad|hone|od)/.test(this._window().navigator.platform));
    }

    public disableBodyScroll(targetElement: any, options?: BodyScrollOptions): void {
        options = options || { target: 'body' };
        initOpt = options;
        if (this.isIosDevice) {
            // targetElement must be provided, and disableBodyScroll must not have been
            // called on this targetElement before.
            if (!targetElement) {
                // eslint-disable-next-line no-console
                console.error(
                    'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.'
                );
                return;
            }

            if (targetElement && !locks.some(lock => lock.targetElement === targetElement)) {
                const lock = {
                    targetElement,
                    options: options || {},
                };

                locks = [...locks, lock];

                targetElement.ontouchstart = (event: HandleScrollEvent) => {
                    if (event.targetTouches.length === 1) {
                        // detect single touch
                        initialClientY = event.targetTouches[0].clientY;
                    }
                };
                targetElement.ontouchmove = (event: HandleScrollEvent) => {
                    if (event.targetTouches.length === 1) {
                        // detect single touch
                        handleScroll(event, targetElement);
                    }
                };

                if (!documentListenerAdded) {
                    document.addEventListener('touchmove', preventDefault, hasPassiveEvents ? { passive: false } : undefined);
                    documentListenerAdded = true;
                }
            }
        } else {
            setOverflowHidden();
            const lock = {
                targetElement,
                options: options || {},
            };

            locks = [...locks, lock];
        }
    }


    public enableBodyScroll(targetElement: any): void {
        if (this.isIosDevice) {
            if (!targetElement) {
                // eslint-disable-next-line no-console
                console.error(
                    'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.'
                );
                return;
            }

            targetElement.ontouchstart = null;
            targetElement.ontouchmove = null;

            locks = locks.filter(lock => lock.targetElement !== targetElement);

            if (documentListenerAdded && locks.length === 0) {
                (document as any).removeEventListener('touchmove', preventDefault, hasPassiveEvents ? { passive: false } : undefined);

                documentListenerAdded = false;
            }
        } else if (locks.length === 1 && locks[0].targetElement === targetElement) {
            restoreOverflowSetting();
            locks = [];
        } else {
            locks = locks.filter(lock => lock.targetElement !== targetElement);
        }
    }

    public clearAllBodyScrollLocks(): void {
        if (this.isIosDevice) {
            // Clear all locks ontouchstart/ontouchmove handlers, and the references
            locks.forEach((lock: Lock) => {
                lock.targetElement.ontouchstart = null;
                lock.targetElement.ontouchmove = null;
            });

            if (documentListenerAdded) {
                (document as any).removeEventListener('touchmove', preventDefault, hasPassiveEvents ? { passive: false } : undefined);
                documentListenerAdded = false;
            }

            locks = [];

            // Reset initial clientY
            initialClientY = -1;
        } else {
            restoreOverflowSetting();
            locks = [];
        }
        initOpt = {};
    }
}

const restoreOverflowSetting = () => {
    // Setting overflow on body/documentElement synchronously in Desktop Safari slows down
    // the responsiveness for some reason. Setting within a setTimeout fixes this.
    setTimeout(() => {
        if (previousBodyPaddingRight !== undefined) {
            document.body.style.paddingRight = previousBodyPaddingRight;

            // Restore previousBodyPaddingRight to undefined so setOverflowHidden knows it
            // can be set again.
            previousBodyPaddingRight = undefined;
        }

        if (previousBodyOverflowSetting !== undefined) {
            (document.querySelector(initOpt.target) as HTMLElement).style.overflow = previousBodyOverflowSetting;

            // Restore previousBodyOverflowSetting to undefined
            // so setOverflowHidden knows it can be set again.
            previousBodyOverflowSetting = undefined;
        }
    });
};

const allowTouchMove = (el: EventTarget): boolean =>
    locks.some(lock => {
        if (lock.options.allowTouchMove && lock.options.allowTouchMove(el)) {
            return true;
        }

        return false;
    });

const preventDefault = (rawEvent: HandleScrollEvent): boolean => {
    const e = rawEvent || this._window().event;

    // For the case whereby consumers adds a touchmove event listener to document.
    // Recall that we do document.addEventListener('touchmove', preventDefault, { passive: false })
    // in disableBodyScroll - so if we provide this opportunity to allowTouchMove, then
    // the touchmove event on document will break.
    if (allowTouchMove(e.target)) {
        return true;
    }

    // Do not prevent if the event has more than one touch (usually meaning this is a multi touch gesture like pinch to zoom)
    if (e.touches.length > 1) { return true; }

    if (e.preventDefault) { e.preventDefault(); }

    return false;
};

const setOverflowHidden = () => {
    if (!initOpt) {
        initOpt = { target: 'body' };
    } else {
        if (!initOpt.target) {
            initOpt.target = 'body';
        }
    }
    // Setting overflow on body/documentElement synchronously in Desktop Safari slows down
    // the responsiveness for some reason. Setting within a setTimeout fixes this.
    setTimeout(() => {
        // If previousBodyPaddingRight is already set, don't set it again.
        if (previousBodyPaddingRight === undefined) {
            const reserveScrollBarGap = !!initOpt && initOpt.reserveScrollBarGap === true;
            const scrollBarGap = this._window().innerWidth - document.documentElement.clientWidth;

            if (reserveScrollBarGap && scrollBarGap > 0) {
                previousBodyPaddingRight = document.body.style.paddingRight;
                document.body.style.paddingRight = `${scrollBarGap}px`;
            }
        }

        // If previousBodyOverflowSetting is already set, don't set it again.
        if (previousBodyOverflowSetting === undefined) {
            previousBodyOverflowSetting = (document.querySelector(initOpt.target) as HTMLElement).style.overflow;
            (document.querySelector(initOpt.target) as HTMLElement).style.overflow = 'hidden';
        }
    });
};

// returns true if `el` should be allowed to receive touchmove events
const isTargetElementTotallyScrolled = (targetElement: any): boolean => {
    return targetElement ? targetElement.scrollHeight - targetElement.scrollTop <= targetElement.clientHeight : false;
};

const handleScroll = (event: HandleScrollEvent, targetElement: any): boolean => {
    const clientY = event.targetTouches[0].clientY - initialClientY;

    if (allowTouchMove(event.target)) {
        return false;
    }

    if (targetElement && targetElement.scrollTop === 0 && clientY > 0) {
        // element is at the top of its scroll
        return preventDefault(event);
    }

    if (isTargetElementTotallyScrolled(targetElement) && clientY < 0) {
        // element is at the top of its scroll
        return preventDefault(event);
    }

    event.stopPropagation();
    return true;
};

let locks: Array<Lock> = [];
let documentListenerAdded = false;
let initialClientY = -1;
let previousBodyOverflowSetting;
let previousBodyPaddingRight;
let hasPassiveEvents = false;

let initOpt: BodyScrollOptions;