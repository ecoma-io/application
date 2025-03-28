import type { Config } from "release-it";

export default {
  git: {
    requireCleanWorkingDir: false,
    commit: true,
    commitMessage: "chore: release the v${version} [skip ci]",
    addUntrackedFiles: true,
    tag: true,
    push: true,
  },
  github: {
    release: true,
    releaseName: "v${version}",
    autoGenerate: true,
  },
  plugins: {
    "@release-it/conventional-changelog": {
      preset: "angular",
      infile: "CHANGELOG.md",
    },
  },
} satisfies Config;
