import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import CodeBlock from '@theme/CodeBlock';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className={clsx('container', styles.heroContent)}>
        <div className={styles.heroText}>
          <h1 className={styles.gradientText}>Archest</h1>
          <p className={styles.subtitle}>
            Enforce strict architectural boundaries directly in your Vitest
            suite.
          </p>
          <div className={styles.buttons}>
            <Link className={styles.buttonPrimary} to="/docs/intro">
              Get Started
            </Link>
            <Link
              className={styles.buttonSecondary}
              href={
                (siteConfig.customFields?.githubUrl as string) ||
                'https://github.com/hinterdupfinger/archest'
              }
            >
              View GitHub
            </Link>
          </div>
        </div>
        <div className={styles.heroCode}>
          <CodeBlock language="typescript" title="architecture.test.ts">
            {`import { parseProject, setupMatchers } from '@archest/vitest';
import { expect, it } from 'vitest';

setupMatchers();
const project = parseProject();

it('enforces clean architecture', () => {
  // 1. Strict Layer Boundaries
  const architecture = project.layeredArchitecture()
    .layer('Domain', 'core/domain')
    .layer('Application', 'core/application')
    .layer('Infrastructure', 'infrastructure');

  expect(architecture.whereLayer('Domain').shouldNotAccessAnyLayer().check()).toPass();

  // 2. Macro-Domain Cycle Detection
  const features = project.getSlices('src/features/*');
  expect(features).toBeFreeOfCycles();
});`}
          </CodeBlock>
        </div>
      </div>
    </header>
  );
}

function Features() {
  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡️</div>
            <h3 className={styles.featureTitle}>Zero Dependencies</h3>
            <p>
              Parses your TypeScript AST natively using the exact same
              TypeScript compiler your project already uses. No heavy external
              dependencies.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🧪</div>
            <h3 className={styles.featureTitle}>Native Vitest Matchers</h3>
            <p>
              Seamlessly hooks into Vitest. Get instant feedback on your
              architecture in your existing CI/CD pipelines right next to your
              unit tests.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔄</div>
            <h3 className={styles.featureTitle}>Cycle Detection</h3>
            <p>
              Automatically traverses your dependency graph to prevent circular
              imports and spaghetti code at both the file and macro-domain
              level.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout title="Home" description="Architecture testing for Vitest">
      <HomepageHeader />
      <main>
        <Features />
      </main>
    </Layout>
  );
}
