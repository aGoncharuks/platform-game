import styles from './index.module.scss';
import { ELEMENTS_MAP } from '../../../old/elements-map.js';
import { Vec } from '../../../old/utils/vec';

export function Index({levels}) {
  let elementClass = '';

  const elementsGrid = levels[0]
    .map(row => ([...row]));
  const getElementView = (elementSymbol) => {
    const { type, modifiers } = ELEMENTS_MAP[elementSymbol];

    if (type === 'empty') {
      return null;
    }


    if (typeof type === 'string') {
      elementClass = styles[type];
    } else {
      const actor = type.create(new Vec(0, 0));
      elementClass = styles[actor.type];
    }


    if (Array.isArray(modifiers) && modifiers.length) {
      const modifiersClasses = modifiers.map(modifier => styles[modifier]);
      elementClass = [elementClass, ...modifiersClasses].join(' ');
    }

    return <div className={`${styles.elementView} ${elementClass}`}></div>;
  }

  return (
    <>
      <h1 className={styles.welcome}>Welcome to builder 👋</h1>
      <div className={styles.levelGrid}>
        {elementsGrid.map((row, rowIndex) =>
          <div className={styles.elementRow} key={rowIndex}>
            {row.map((elementSymbol, elementIndex) =>
              <div className={styles.elementCell} key={elementIndex}>
                {getElementView(elementSymbol)}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const res = await fetch('http://localhost:4200/api/levels');
  const levels = await res.json();
  return { props: { levels } };
}

export default Index;
