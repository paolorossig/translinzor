# Translinzor

Translinzor is a logistics management system built with Next.js, TypeScript, and Supabase.

## Features

- Shipment tracking and management
- Order creation and bulk upload
- Effectiveness reports and charts
- Role-based user authentication

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Supabase for authentication and database
- Drizzle ORM
- Tailwind CSS
- Shadcn UI components
- Recharts for data visualization

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   pnpm install
   ```
3. Set up environment variables (see `.env.example`)
4. Run database migrations:
   ```
   pnpm db:push
   ```
5. Start the development server:
   ```
   pnpm dev
   ```

## Project Structure

- `/src`: Main source code
  - `/app`: Next.js app router pages and layouts
  - `/components`: Reusable React components
  - `/config`: Configuration files and constants  
  - `/db`: Database schema and queries
  - `/lib`: Utility functions and shared logic
  - `/types`: General types and interfaces
  
- `/drizzle`: Database migrations

## License

This project is licensed under the MIT License.