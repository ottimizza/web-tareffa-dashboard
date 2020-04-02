export class ClipboardUtils {

  public static fallbackCopyTextToClipboard(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';  // avoid scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  }
  public static copyTextToClipboard(text: string) {
    if (!navigator.clipboard) {
      ClipboardUtils.fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      console.log('Async: Copying to clipboard was successful!');
    }, (err) => {
      console.error('Async: Could not copy text: ', err);
    });
  }

}