export type SignatureType = "handwritten-image" | "certificate";

export interface HandwrittenSignature {
  type: "handwritten-image";
  dataUrl: string;
  capturedAt: string;
}

/** Reserved for future certificate-based signing — not implemented yet. A handwritten
 * signature captured on a touchscreen is NOT a legally certified digital signature;
 * keep the two representations distinct so the UI never conflates them. */
export interface CertificateSignature {
  type: "certificate";
  certificateId: string;
  signedAt: string;
}

export type Signature = HandwrittenSignature | CertificateSignature;
