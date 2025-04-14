# Welcome to your Lovable project

This project is an AI Marketplace that allows creating and using custom AI models with OpenAI integration.

## Project info

**URL**: https://lovable.dev/projects/c2a7f96d-a06a-48af-b8e6-2ee399f24cc1

## AI Integration Setup

The application uses a Supabase Edge Function to securely communicate with OpenAI's API. Follow these steps to set it up:

### 1. Configure Supabase Environment Variables

Before deploying the Edge Function, you need to set up your Supabase environment variables:

1. Create a file named `.env.local` in the root of your project with:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   Replace the values with your actual Supabase project URL and anonymous key.

2. Restart your development server after adding these variables.

For more detailed instructions, see the `SUPABASE_ENV_SETUP.md` file.

### 2. Deploy the Supabase Edge Function

1. Make sure you have Supabase CLI installed:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase CLI:
   ```bash
   supabase login
   ```

3. Navigate to the Edge Function directory:
   ```bash
   cd supabase/functions/openai-chat
   ```

4. Deploy the function to your Supabase project:
   ```bash
   supabase functions deploy openai-chat --project-ref your-project-ref
   ```
   Replace `your-project-ref` with your Supabase project reference ID.

### 3. Set up OpenAI API Key

The Edge Function requires an OpenAI API key to function:

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)

2. Set it as a secret in your Supabase project:
   ```bash
   supabase secrets set OPENAI_API_KEY=your_openai_api_key --project-ref your-project-ref
   ```
   Replace `your_openai_api_key` with your actual OpenAI API key.

3. Alternatively, you can set the secret through the Supabase dashboard:
   - Go to your project dashboard
   - Navigate to Settings > API > Edge Functions > Secrets
   - Add a new secret with name `OPENAI_API_KEY` and your API key as the value
   
4. (Optional) Control which models are used:
   - To always use free models (like GPT-3.5 Turbo) instead of GPT-4o, set this secret:
   ```bash
   supabase secrets set USE_FREE_MODELS=true --project-ref your-project-ref
   ```
   - This is useful if you want to avoid charges for more expensive models

### Troubleshooting

If you encounter issues with AI responses:

1. Check the console logs for detailed error messages
2. Verify that your OpenAI API key is correctly set in Supabase secrets
3. Ensure the Edge Function is properly deployed
4. If you see errors about GPT-4o access or billing, try setting `USE_FREE_MODELS=true` as described above
5. The application includes an improved fallback system:
   - If GPT-4o isn't available, it will try GPT-3.5 Turbo
   - If no OpenAI models work, it falls back to simulated responses by category
   - The user interface will show which model is actually responding

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/c2a7f96d-a06a-48af-b8e6-2ee399f24cc1) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/c2a7f96d-a06a-48af-b8e6-2ee399f24cc1) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
