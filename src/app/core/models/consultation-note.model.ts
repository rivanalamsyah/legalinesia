export interface ConsultationAttachment {
  id: string;
  fileName: string;
  fileSize: number; // in bytes
  fileType: string;
  fileUrl: string;
  uploadedAt: string;
  uploadedByUid: string;
}

export interface ConsultationNote {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  professionalId: string;
  professionalName: string;
  title: string;
  caseCategory: string;
  summary: string;
  legalAdvice: string;
  actionItems: string[];
  confidentialNotes?: string;
  attachments: ConsultationAttachment[];
  isSharedWithCustomer: boolean;
  createdAt: string;
  updatedAt: string;
}
