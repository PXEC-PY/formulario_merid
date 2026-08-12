import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { EmailGateModal } from "./EmailGateModal";
import { logDownload, type DownloadLogMeta } from "../../services/downloadLog";

const STORAGE_KEY = "downloaderEmail";

interface GatedDownloadLinkProps {
  href: string;
  fileName: string;
  className: string;
  children: ReactNode;
  onAuthorizedDownload?: () => void;
  logMeta: DownloadLogMeta;
}

/** Drop-in replacement for a plain `<a href download>` — before the very first download
 * in a browser session, asks for an email (no password, no confirmation — see
 * EmailGateModal) so every generated document can be traced back to who requested it.
 * The email is remembered in sessionStorage so it's only asked once per visit. */
export function GatedDownloadLink({ href, fileName, className, children, onAuthorizedDownload, logMeta }: GatedDownloadLinkProps) {
  const anchorRef = useRef<HTMLAnchorElement | null>(null);
  const [showGate, setShowGate] = useState(false);

  const proceed = (email: string) => {
    logDownload(logMeta, email);
    onAuthorizedDownload?.();
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const storedEmail = sessionStorage.getItem(STORAGE_KEY);
    if (!storedEmail) {
      e.preventDefault();
      setShowGate(true);
      return;
    }
    proceed(storedEmail);
  };

  const handleGateSubmit = (email: string) => {
    // Stores the email, then re-fires the anchor's own click — handleClick sees the
    // now-stored email and calls proceed() itself, so it only ever runs once per click.
    sessionStorage.setItem(STORAGE_KEY, email);
    setShowGate(false);
    anchorRef.current?.click();
  };

  return (
    <>
      <a ref={anchorRef} href={href} download={fileName} onClick={handleClick} className={className}>
        {children}
      </a>
      {showGate && <EmailGateModal onSubmit={handleGateSubmit} onClose={() => setShowGate(false)} />}
    </>
  );
}
