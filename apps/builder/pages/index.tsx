import styles from './index.module.scss';

export function Index({levels}) {
  const EMPTY_CELL_SYMBOL = '.';
  const elementsGrid = levels[0]
    .map(row => ([...row]));

  return (
    <div className={styles.page}>
      <div id="welcome">
        <h1>
          Welcome to builder 👋
        </h1>
      </div>
      <div className={styles.levelGrid}>
        {elementsGrid.map((row, rowIndex) =>
          <div className={styles.elementRow} key={rowIndex}>
            {row.map((element, elementIndex) =>
              <div className={styles.elementCell} key={elementIndex}>
                {element !== EMPTY_CELL_SYMBOL && <div className={styles.elementSymbol}>{element}</div>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const res = await fetch('http://localhost:4200/api/levels');
  const levels = await res.json();
  return { props: { levels } };
}

export default Index;
