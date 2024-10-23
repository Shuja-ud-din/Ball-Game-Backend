# 🚀 Ball Game TypeScript backend

## 🛠️ Getting Started

### Step 1: ⚙️ Environment Configuration

- 📄 **Create `.env.development`:** Copy `.env.example` to `.env.development`.
- 🔧 **Update `.env.development`:** Fill in necessary environment variables.
- 🛠️ **Node Version Setup:**
  - Run `bin/pre-install` in a bash terminal (e.g., Git Bash) to automatically install the recommended Node version.
  - If the script doesn't work, manually install the Node version specified in the `.nvmrc` file.
- 📦 **Install Dependencies:** Run `npm install` to install all required packages.

---

### Step 2: 🏃‍♂️ Running the Project

#### Without Docker

- 🌱 **Seed Database:**
  - For development: `npm run seed:dev`
  - For local production: `npm run seed:prod`
- 🔌 **Redis Setup:**

  There are two ways to setup Redis:

  1. **Setup Redis locally**

     - 🌐 Download Redis from [redis.io](https://redis.io/download) and follow the installation instructions.
     - 🚀 Start Redis server by running `redis-server` in your terminal.

  2. **Setup Redis locally via Docker**
     - 🐳 Run the following command to fetch and start the Redis Docker container:
       ```bash
       npm run start-redis
       ```
     - 🔗 This will start the Redis container and map it to the default port 6379 on your host.

- 🛠️ **Development Mode:** Start the project in development mode with `npm run dev`.
- 🏗️ **Building:** Build the project using `npm run build`.
- 🚀 **Production Mode:**
  - Set up `.env.production.local` according to `.env.example`.
  - Run the following commands to build and start the project:
    ```bash
    npm run build && npm run start
    ```

#### Using Docker

- 🐳 **Prerequisites:**
  - Ensure `docker` and `docker-compose` are installed.
  - Start the Docker engine using the **Docker Desktop App** (which installs both Docker and Docker Compose automatically).
- 🛠️ **Development Workflow:**

  - **Create `.env.development.docker`:** Copy `.env.example` to `.env.development.docker`.
  - **Start Application:** To start the Docker container in development mode:
    ```bash
    npm run start-docker:dev
    ```
  - **Install Dependencies:** If dependencies aren’t installed automatically, run:
    ```bash
    npm run install-dependencies-docker:dev
    ```
  - **Seed Database:** To seed the Dockerized database in development:
    ```bash
    npm run seed-docker:dev
    ```
  - **Stopping Containers Without Removal:** To stop containers without removing them, use:

    - **Windows/Linux:** `Ctrl + C`
    - **Mac:** `CMD + C`

  - **Stop Application (remove the container as well):** To stop the Docker container in development
    ```bash
    npm run stop-docker:dev
    ```

- 🚀 **Production Workflow:**

  - **Create `.env.production.docker`:** Copy `.env.example` to `.env.production.docker`.
  - **Start Application:** To start the Docker container in production mode:
    ```bash
    npm run start-docker:prod
    ```
  - **Install Dependencies:** If dependencies aren’t installed automatically, run:
    ```bash
    npm run install-dependencies-docker:prod
    ```
  - **Seed Database:** To seed the Dockerized database in production:
    ```bash
    npm run seed-docker:prod
    ```
  - **Stopping Containers Without Removal:** To stop containers without removing them, use:

    - **Windows/Linux:** `Ctrl + C`
    - **Mac:** `CMD + C`

  - **Stop Application (remove the container as well):** To stop the Docker container in development
    ```bash
    npm run stop-docker:prod
    ```

---

## 🔄 Additional Commands

- 🚧 **Rebuild & Restart Containers:** `docker-compose up --build`
- 🗑️ **Remove Containers & Volumes:** `docker-compose down -v`

## 💡 Tips

- 🛑 **Stopping Containers:** You can stop containers without removing them using `Ctrl + C` or `CMD + C` in the terminal.

## 📁 Project Structure

```
└── 📁ball-game-server
    └── 📁.husky
        └── 📁_
            └── .gitignore
            └── applypatch-msg
            └── commit-msg
            └── h
            └── husky.sh
            └── post-applypatch
            └── post-checkout
            └── post-commit
            └── post-merge
            └── post-rewrite
            └── pre-applypatch
            └── pre-auto-gc
            └── pre-commit
            └── pre-push
            └── pre-rebase
            └── prepare-commit-msg
        └── commit-msg
        └── pre-commit
        └── pre-push
    └── 📁ai-services
        └── main.py
        └── requirments.txt
    └── 📁bin
        └── pre-install
    └── 📁public
        └── 📁images
            └── 1726230469743.png
    └── 📁src
        └── 📁config
            └── env.ts
        └── 📁constants
            └── apiRoutes.ts
        └── 📁middleware
            └── errorHandler.ts
            └── rateLimiter.ts
            └── requestLogger.ts
        └── 📁routes
            └── healthCheck.ts
            └── routes.ts
        └── 📁utils
        └── custom.d.ts
        └── index.ts
        └── server.ts
    └── .dockerignore
    └── .env.development
    └── .env.development.docker
    └── .env.example
    └── .env.production
    └── .env.production.docker
    └── .env.production.local
    └── .eslintignore
    └── .eslintrc.json
    └── .gitignore
    └── .nvmrc
    └── .prettierignore
    └── .prettierrc
    └── CHANGELOG.md
    └── CODE_OF_CONDUCT.md
    └── commitlint.config.ts
    └── docker-compose.dev.yml
    └── Dockerfile.dev
    └── LICENSE
    └── package-lock.json
    └── package.json
    └── README.md
    └── release.config.cjs
    └── renovate.json
    └── tsconfig.json
    └── tsup.config.ts
    └── vite.config.mts
```
