export interface DocumentResponse {
  id: number;
  claimId: number;
  fileName: string;
  s3Key: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}