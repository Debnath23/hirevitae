const { execSync } = require("child_process")

console.log("Setting up database...")

try {
  // Generate Prisma client
  console.log("Generating Prisma client...")
  execSync("npx prisma generate", { stdio: "inherit" })

  // Push schema to database
  console.log("Pushing schema to database...")
  execSync("npx prisma db push", { stdio: "inherit" })

  // Seed the database
  console.log("Seeding database...")
  execSync("npx prisma db seed", { stdio: "inherit" })

  console.log("Database setup completed successfully!")
} catch (error) {
  console.error("Error setting up database:", error.message)
  process.exit(1)
}
