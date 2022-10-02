import styles from './index.module.scss';

export function Index({levels}) {

  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <h1>
              Welcome to builder 👋
            </h1>
          </div>
          <div className="levels">{levels}</div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const res = await fetch('http://localhost:4200/api/levels')
  const levels = await res.json()
  return { props: { levels } };
}

export default Index;
