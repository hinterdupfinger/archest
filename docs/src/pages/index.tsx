import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import CodeBlock from '@theme/CodeBlock';
import Layout from '@theme/Layout';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';
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
            Enforce strict architectural boundaries directly in your test
            suites. Support for JavaScript, TypeScript, Java, and Kotlin.
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
          <Tabs defaultValue="vitest" className="homepage-tabs">
            <TabItem value="vitest" label="Vitest (TS)">
              <CodeBlock language="typescript" title="architecture.test.ts">
                {`import { parseProject, setupMatchers } from '@archest/vitest';
import { expect, it } from 'vitest';

setupMatchers();
const project = parseProject();

it('enforces clean architecture', () => {
  // 1. Strict Layer Boundaries
  const architecture = project.layeredArchitecture()
    .layer('Domain', 'src/domain')
    .layer('Application', 'src/application')
    .layer('Infrastructure', 'src/infrastructure');

  expect(architecture.whereLayer('Domain')
    .shouldNotAccessAnyLayer().check()).toPass();

  // 2. Macro-Domain Cycle Detection
  const features = project.getSlices('src/features/*');
  expect(features).toBeFreeOfCycles();
});`}
              </CodeBlock>
            </TabItem>
            <TabItem value="jest" label="Jest (TS)">
              <CodeBlock language="typescript" title="architecture.test.ts">
                {`import { parseProject, setupMatchers } from '@archest/jest';
import { expect, it } from '@jest/globals';

setupMatchers();
const project = parseProject();

it('enforces clean architecture', () => {
  // 1. Strict Layer Boundaries
  const architecture = project.layeredArchitecture()
    .layer('Domain', 'src/domain')
    .layer('Application', 'src/application')
    .layer('Infrastructure', 'src/infrastructure');

  expect(architecture.whereLayer('Domain')
    .shouldNotAccessAnyLayer().check()).toPass();

  // 2. Macro-Domain Cycle Detection
  const features = project.getSlices('src/features/*');
  expect(features).toBeFreeOfCycles();
});`}
              </CodeBlock>
            </TabItem>
            <TabItem value="junit6" label="JUnit 6 (Java)">
              <CodeBlock language="java" title="ArchitectureTest.java">
                {`package org.archest.junit6;

import org.archest.core.ArchestProject;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(ArchestExtension.class)
@AnalyzeClasses(packages = "com.example")
public class ArchitectureTest {

    @ArchTest
    public static final ArchestRule repositoryShouldNotDependOnController =
        ArchestRules.classes()
            .matching(".*Repository")
            .shouldNotDependOn(".*Controller");

    @ArchTest
    public static final ArchestRule packageShouldBeFreeOfCycles =
        ArchestRules.files()
            .matching(".*")
            .shouldBeFreeOfCycles();
}`}
              </CodeBlock>
            </TabItem>
            <TabItem value="kotest" label="Kotest (Kotlin)">
              <CodeBlock language="kotlin" title="ArchitectureSpec.kt">
                {`package org.archest.kotest

import io.kotest.core.spec.style.StringSpec
import org.archest.core.ArchestProject
import java.io.File

class ArchitectureSpec : StringSpec({
    "enforce clean architecture boundaries" {
        val files = locateFiles(File(System.getProperty("user.dir")))
        val project = ArchestProject.parse(files)
        
        // 1. Assert Class Dependencies
        project.classes(".*Repository") shouldNotDependOn ".*Controller"
        
        // 2. Check for Circular Dependencies
        project.files(".*").shouldBeFreeOfCycles()
    }
})`}
              </CodeBlock>
            </TabItem>
          </Tabs>
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

function Installation() {
  return (
    <section className={styles.installSection}>
      <div className="container">
        <h2 className={styles.installTitle}>Installation</h2>
        <Tabs defaultValue="pnpm" groupId="js-install">
          <TabItem value="pnpm" label="pnpm">
            <CodeBlock language="bash">
              {`# For Vitest\npnpm add -D @archest/vitest\n\n# For Jest\npnpm add -D @archest/jest`}
            </CodeBlock>
          </TabItem>
          <TabItem value="npm" label="npm">
            <CodeBlock language="bash">
              {`# For Vitest\nnpm install --save-dev @archest/vitest\n\n# For Jest\nnpm install --save-dev @archest/jest`}
            </CodeBlock>
          </TabItem>
          <TabItem value="yarn" label="Yarn">
            <CodeBlock language="bash">
              {`# For Vitest\nyarn add -D @archest/vitest\n\n# For Jest\nyarn add -D @archest/jest`}
            </CodeBlock>
          </TabItem>
          <TabItem value="gradle" label="Gradle (Kotlin)">
            <CodeBlock language="kotlin">
              {`// For JUnit 6\ntestImplementation("org.archest:archest-junit6:0.1.0")\n\n// For Kotest\ntestImplementation("org.archest:archest-kotest:0.1.0")`}
            </CodeBlock>
          </TabItem>
          <TabItem value="gradle-groovy" label="Gradle (Groovy)">
            <CodeBlock language="groovy">
              {`// For JUnit 6\ntestImplementation 'org.archest:archest-junit6:0.1.0'\n\n// For Kotest\ntestImplementation 'org.archest:archest-kotest:0.1.0'`}
            </CodeBlock>
          </TabItem>
          <TabItem value="maven" label="Maven">
            <CodeBlock language="xml">
              {`<!-- For JUnit 6 -->\n<dependency>\n    <groupId>org.archest</groupId>\n    <artifactId>archest-junit6</artifactId>\n    <version>0.1.0</version>\n    <scope>test</scope>\n</dependency>\n\n<!-- For Kotest -->\n<dependency>\n    <groupId>org.archest</groupId>\n    <artifactId>archest-kotest</artifactId>\n    <version>0.1.0</version>\n    <scope>test</scope>\n</dependency>`}
            </CodeBlock>
          </TabItem>
        </Tabs>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout title="Home" description="Architecture testing for Archest">
      <HomepageHeader />
      <main>
        <Features />
        <Installation />
      </main>
    </Layout>
  );
}
