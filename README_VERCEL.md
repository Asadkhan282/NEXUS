# Deploying NEXUS to Vercel

This project is configured for easy deployment to [Vercel](https://vercel.com).

## Prerequisites

1.  **Vercel Account:** Sign up at [vercel.com](https://vercel.com).
2.  **Vercel CLI (Optional):** Install via `npm i -g vercel`.

## Deployment Steps

### Method 1: Vercel Dashboard (Recommended)

1.  Push your code to a GitHub, GitLab, or Bitbucket repository.
2.  Import the project in the Vercel Dashboard.
3.  Vercel will automatically detect the **Vite** framework.
4.  **Environment Variables:** Add the following variables in the Vercel project settings:
    *   `GEMINI_API_KEY`: Your Google Gemini API Key.
5.  Click **Deploy**.

### Method 2: Vercel CLI

1.  Run `vercel` in the project root.
2.  Follow the prompts to link the project.
3.  Add environment variables when prompted or via the dashboard.
4.  Run `vercel --prod` for production deployment.

## Troubleshooting

### "Neural Link Offline: No API key detected"
If you see this error on Vercel:
1.  Go to your **Vercel Project Settings** > **Environment Variables**.
2.  Ensure `GEMINI_API_KEY` is added and its value is correct.
3.  **Redeploy** your application for the changes to take effect.

### Firebase Authentication Errors
If login fails on Vercel:
1.  Go to the [Firebase Console](https://console.firebase.google.com).
2.  Navigate to **Authentication** > **Settings** > **Authorized domains**.
3.  Add your Vercel deployment URL (e.g., `your-app.vercel.app`) to the list.
