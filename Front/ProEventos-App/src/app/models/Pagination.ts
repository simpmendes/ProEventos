export class Pagination {
  currentPage: number;
  itensPerPage: number;
  totalItems: number;
  totalpages: number;
}

export class PaginationResult<T>{
  result: T;
  pagination: Pagination;
}
