let scrollLockCount = 0;

interface ScrollSnapshot {
  bodyOverflow: string;
  htmlOverflow: string;
  bodyOverscrollBehavior: string;
  bodyTouchAction: string;
}

let snapshot: ScrollSnapshot | null = null;

function hasDocument() {
  return typeof document !== "undefined";
}

function lockBodyScroll() {
  if (!hasDocument()) return;

  if (scrollLockCount === 0) {
    const body = document.body;
    const html = document.documentElement;
    snapshot = {
      bodyOverflow: body.style.overflow,
      htmlOverflow: html.style.overflow,
      bodyOverscrollBehavior: body.style.overscrollBehavior,
      bodyTouchAction: body.style.touchAction,
    };

    body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    body.style.overscrollBehavior = "contain";
    body.style.touchAction = "none";
  }

  scrollLockCount += 1;
}

function unlockBodyScroll() {
  if (!hasDocument() || scrollLockCount === 0) return;

  scrollLockCount -= 1;
  if (scrollLockCount > 0) return;

  const body = document.body;
  const html = document.documentElement;
  if (snapshot) {
    body.style.overflow = snapshot.bodyOverflow;
    html.style.overflow = snapshot.htmlOverflow;
    body.style.overscrollBehavior = snapshot.bodyOverscrollBehavior;
    body.style.touchAction = snapshot.bodyTouchAction;
  }
  snapshot = null;
}

export { lockBodyScroll, unlockBodyScroll };
