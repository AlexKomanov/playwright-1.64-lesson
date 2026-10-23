import type { FullConfig } from '@playwright/test';

// NEW in 1.64: config.filteredProjects = the projects left after the --project filter
// (and after `default: false` projects were skipped).
export default async function globalSetup(config: FullConfig) {
  const selected = config.filteredProjects.map(p => p.name);
  const all = config.projects.map(p => p.name);
  console.log(`\n[global-setup] projects selected: ${selected.join(', ')}  (configured: ${all.join(', ')})`);

  // Idea from currents.dev: on CI, fail fast if a browser silently dropped out of the run.
  if (process.env.CI && process.env.EXPECTED_PROJECTS) {
    const missing = process.env.EXPECTED_PROJECTS.split(',').filter(name => !selected.includes(name));
    if (missing.length)
      throw new Error(`CI expected projects that are not selected: ${missing.join(', ')}`);
  }
}
