import { useEffect, useRef, useState } from "preact/hooks";
import type { ComponentChildren } from "preact";
import { AnimatePresence, motion } from "framer-motion";
import "./tile-pager.css";

export type TilePagerBreakpoints = {
  phone: number;
  tablet: number;
  desktop: number;
};

export type TilePagerProps<T> = {
  getData: (size: number, page: number) => { data: T[]; count: number };
  renderTile: (item: T, opt: { size: number }) => ComponentChildren;
  persistentTiles?: Record<string, ComponentChildren>;
  breakpoints?: TilePagerBreakpoints;
};

type TileItem<T> =
  | {
      item: T;
      key: number;
    }
  | {
      key: string;
      tile: ComponentChildren;
    };

type TileGridSize = {
  rows: number;
  tileSize: number;
};

const defaultBreakpoints: TilePagerBreakpoints = {
  phone: 2,
  tablet: 4,
  desktop: 5,
};

const gap = 16;
const resizeTimeoutMs = 20;

function getColumns(breakpoints: TilePagerBreakpoints): number {
  if (typeof window === "undefined") {
    return breakpoints.desktop;
  }
  const width = window.innerWidth;

  if (width < 768) {
    return breakpoints.phone;
  }

  if (width < 1200) {
    return breakpoints.tablet;
  }

  return breakpoints.desktop;
}

function calculateGridSize(
  width: number,
  height: number,
  columns: number,
): TileGridSize {
  if (width <= 0 || height <= 0 || columns <= 0) {
    return {
      rows: 0,
      tileSize: 0,
    };
  }

  const tileSize = (width - (columns + 1) * gap) / columns;

  if (tileSize > height) {
    return {
      rows: 1,
      tileSize: height - 2 * gap,
    };
  }

  const rows = Math.max(1, Math.floor((height + gap) / (tileSize + gap)));
  return {
    rows,
    tileSize,
  };
}

export function TilePager<T>({
  getData,
  renderTile,
  persistentTiles = {},
  breakpoints = defaultBreakpoints,
}: TilePagerProps<T>) {
  const contentRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [columns, setColumns] = useState(() => getColumns(breakpoints));
  const [gridSize, setGridSize] = useState<TileGridSize>({
    rows: 0,
    tileSize: 0,
  });

  const [page, setPage] = useState(0);
  const [items, setItems] = useState<TileItem<T>[]>([]);
  const [itemsCount, setItemsCount] = useState<number>(0);
  const previousItemsCount = useRef<number>(0);

  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const newColumns = getColumns(breakpoints);

      setColumns((current) => (current === newColumns ? current : newColumns));
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoints]);

  // reset when page size changed to first page
  useEffect(() => setPage(0), [columns, gridSize.rows]);

  useEffect(() => {
    const element = contentRef.current;

    if (!element) return;

    const updateGridSize = (width: number, height: number) => {
      setGridSize(calculateGridSize(width, height, columns));
    };

    updateGridSize(element.clientWidth, element.clientHeight);

    const observer = new ResizeObserver((entries) => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);

      resizeTimeoutRef.current = setTimeout(() => {
        const entry = entries[0];
        if (!entry) return;
        updateGridSize(entry.contentRect.width, entry.contentRect.height);
      }, resizeTimeoutMs);
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
        resizeTimeoutRef.current = null;
      }
    };
  }, [columns]);

  useEffect(() => {
    const size = columns * gridSize.rows;
    if (size === 0) {
      setItems([]);
      return;
    }

    const tiles = Object.entries(persistentTiles);
    const { data, count } = getData(size - tiles.length, page);

    const allTileItems: TileItem<T>[] = [
      ...data.map((item, key) => ({ item, key })),
      ...tiles.map(([key, tile]) => ({ key, tile })),
    ];

    setItems(allTileItems);
    setItemsCount(count);
  }, [getData, columns, gridSize.rows, page, persistentTiles]);

  const showButtons = columns === breakpoints.desktop;
  const pageSize =
    columns * gridSize.rows - Object.keys(persistentTiles).length;
  const lastPage = Math.ceil(itemsCount / pageSize) - 1;
  const hasPrev = page > 0;
  const hasNext = page < lastPage;

  useEffect(() => {
    const previous = previousItemsCount.current;
    previousItemsCount.current = itemsCount;

    if (previous === 0) return;

    if (itemsCount > previous) {
      // After adding station move to that page
      setPage(lastPage);
    } else if (previous > itemsCount) {
      //When after removing current page in empty
      setPage((page) => (page > lastPage ? lastPage : page));
    }
  }, [itemsCount]);

  const previousPage = () => {
    if (!hasPrev) return;
    setDirection(-1);
    setPage((current) => current - 1);
  };

  const nextPage = () => {
    if (!hasNext) return;
    setDirection(1);
    setPage((current) => current + 1);
  };

  const gridStyle = {
    "--tile-columns": columns,
    "--tile-rows": gridSize.rows,
    "--tile-size": `${gridSize.tileSize}px`,
  };

  return (
    <div class="tile-pager-wrapper">
      <div class="tile-pager">
        {showButtons && (
          <button
            class="button"
            onClick={previousPage}
            disabled={!hasPrev}
            aria-label="prev page"
          >
            <span class="icon">
              <i class="fas fa-caret-left"></i>
            </span>
          </button>
        )}

        <div ref={contentRef} class="tile-pager-content">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={`${page}-${pageSize}`}
              class="tile-pager-grid"
              style={gridStyle}
              custom={direction}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(_, info) => {
                const offset = info.offset.x;
                const velocity = info.velocity.x;

                if (offset < -80 || velocity < -500) {
                  nextPage();
                  return;
                }

                if (offset > 80 || velocity > 500) {
                  previousPage();
                }
              }}
              variants={{
                enter: (animationDirection: number) => ({
                  opacity: 0,
                  x: animationDirection > 0 ? 80 : -80,
                }),
                center: {
                  opacity: 1,
                  x: 0,
                },
                exit: (animationDirection: number) => ({
                  opacity: 0,
                  x: animationDirection > 0 ? -80 : 80,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
            >
              {items.map((tileItem) => {
                return "item" in tileItem ? (
                  <div class="tile-pager-item" key={tileItem.key}>
                    {renderTile(tileItem.item, { size: gridSize.tileSize })}
                  </div>
                ) : (
                  <div class="tile-pager-item" key={tileItem.key}>
                    {tileItem.tile}
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {showButtons && (
          <button
            class="button"
            onClick={nextPage}
            disabled={!hasNext}
            aria-label="next page"
          >
            <span class="icon">
              <i class="fas fa-caret-right"></i>
            </span>
          </button>
        )}
      </div>
      <progress
        class="progress is-primary is-small"
        value={page + 1}
        max={lastPage + 1}
      ></progress>
    </div>
  );
}
