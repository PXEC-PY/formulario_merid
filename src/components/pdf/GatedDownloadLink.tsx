import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import { AuthGateModal } from "../auth/AuthGateModal";
import { logDownload, type DownloadLogMeta } from "../../services/downloadLog";

interface GatedDownloadLinkProps {
  href: string;
  fileName: string;
  className: string;
  children: ReactNode;
  onAuthorizedDownload?: () => void;
  logMeta: DownloadLogMeta;
}

/** Drop-in replacement for a plain `<a href download>` — lets anyone fill out and review
 * a form, but requires being logged in (any account, any role) at the exact moment of
 * download, so every generated document can be traced back to who requested it. */
export function GatedDownloadLink({ href, fileName, className, children, onAuthorizedDownload, logMeta }: GatedDownloadLinkProps) {
  const { user } = useAuth();
  const anchorRef = useRef<HTMLAnchorElement | null>(null);
  const [showGate, setShowGate] = useState(false);
  const pendingRef = useRef(false);

  useEffect(() => {
    if (pendingRef.current && user) {
      pendingRef.current = false;
      setShowGate(false);
      anchorRef.current?.click();
    }
  }, [user]);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!user) {
      e.preventDefault();
      pendingRef.current = true;
      setShowGate(true);
      return;
    }
    logDownload(logMeta, user.id);
    onAuthorizedDownload?.();
  };

  return (
    <>
      <a ref={anchorRef} href={href} download={fileName} onClick={handleClick} className={className}>
        {children}
      </a>
      {showGate && <AuthGateModal onClose={() => setShowGate(false)} />}
    </>
  );
}
