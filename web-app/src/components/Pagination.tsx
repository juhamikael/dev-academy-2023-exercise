import {
  RxCaretLeft,
  RxDoubleArrowLeft,
  RxCaretRight,
  RxDoubleArrowRight,
} from "react-icons/rx";

interface IPaginationProps {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<IPaginationProps> = ({
  totalPages,
  currentPage,
  setCurrentPage,
}) => {
  const start = Math.max(1, currentPage - 3);

  const end = Math.min(totalPages, currentPage + 2);
  const style = `mx-2 w-16 rounded-lg bg-red-400 py-2 text-white hover:bg-red-300 `;

  return (
    <div className="flex justify-center">
      {currentPage !== 1 ? (
        <>
          <button
            key="double-arrow-left"
            className={style}
            disabled={1 === currentPage}
            onClick={() => setCurrentPage(1)}
          >
            <span className="flex justify-center">
              <RxDoubleArrowLeft size={25} />
            </span>
          </button>
          <button
            key="caret-left"
            className={style}
            disabled={1 === currentPage}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <span className="flex justify-center">
              <RxCaretLeft size={30} />
            </span>
          </button>
        </>
      ) : null}

      {Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
        (page) => (
          <button
            className={`mx-2 w-16 rounded-lg ${
              page === currentPage ? "bg-blue-500" : "bg-blue-300"
            } py-2 text-white hover:bg-blue-700`}
            key={page}
            disabled={page === currentPage}
            onClick={() => setCurrentPage(page)}
          >
            <div className="flex justify-center">{page}</div>
          </button>
        )
      )}

      {currentPage !== totalPages ? (
        <>
          <button
            key="caret-right"
            className={style}
            disabled={totalPages === currentPage}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <span className="flex justify-center">
              <RxCaretRight size={30} />
            </span>
          </button>
          <button
            key="double-arrow-right"
            className={style}
            disabled={totalPages === currentPage}
            onClick={() => setCurrentPage(totalPages)}
          >
            <span className="flex justify-center">
              <RxDoubleArrowRight size={25} />
            </span>
          </button>
        </>
      ) : null}
    </div>
  );
};

export default Pagination;
