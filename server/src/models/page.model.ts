export interface Page<T> {
  entries: T[];
  pageNumber: number;
  pageSize: number;
  totalEntries: number;
  totalPages: number;
}
