# Todo App

A full-stack Todo application built with Next.js, Redux Toolkit, and Drizzle ORM.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Backend/API**: Next.js Route Handlers
- **Database**: [SQLite](https://www.sqlite.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: JWT (JSON Web Tokens) with `bcrypt` for password hashing
- **Icons/Styles**: Vanilla CSS & Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file (refer to `.env.local` in the project).

### Running the Project

- **Development Mode**:
  ```bash
  npm run dev
  ```
- **Build for Production**:
  ```bash
  npm run build
  ```
- **Start Production Server**:
  ```bash
  npm run start
  ```
- **Linting**:
  ```bash
  npm run lint
  ```

## Deployment

### Netlify

This project is configured for deployment on [Netlify](https://www.netlify.com/).

#### Configuration

The `netlify.toml` file in the root directory manages the build settings:
- **Build command**: `npm run build`
- **Publish directory**: `.next`

#### Database Persistence Warning

**Important**: This project currently uses a local SQLite database (`sqlite.db`). Netlify's serverless functions have an ephemeral file system, meaning:
1. Data will **not persist** between function executions or deployments.
2. The database will be reset frequently.

For production use on Netlify, it is highly recommended to switch to a hosted database provider such as:
- **[Turso](https://turso.tech/)**: SQLite-compatible, works great with Drizzle.

#### Environment Variables

Ensure the following environment variables are set in the Netlify UI:
- `JWT_SECRET`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`
- `DATABASE_URL` (If using a remote database)

## Database Management

The project uses Drizzle ORM with SQLite.

- To manage migrations or view the database:
  ```bash
  npx drizzle-kit studio # Open Drizzle Studio
  ```

## License

Private / Internal
