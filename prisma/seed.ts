import { DEMO_SEED } from './seed-data';

async function main() {
  console.info(
    `Demo seed data prepared: ${DEMO_SEED.campuses.length} campuses, ${DEMO_SEED.classes.length} classes, ${DEMO_SEED.students.length} students.`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
