export interface CdkApiResponse<T> {
  data: T;
  message: string;
  status: number;
  time: string;
}

export const ForceCacheHeader = 'TransferState-Force-Cache';

export const ForceNoCacheHeader = 'TransferState-Force-No-Cache';
