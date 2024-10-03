export const vibrate = (duration: number) => {
  // @ts-expect-error: webkit will be present in Swift app
  if (window.webkit?.messageHandlers?.vibrate) {
    // @ts-expect-error: webkit will be present in Swift app
    window.webkit.messageHandlers.vibrate.postMessage({ duration });
  } else if (navigator.vibrate) {
    navigator.vibrate(duration);
  }
};