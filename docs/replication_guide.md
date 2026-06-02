# Rate My Landlord — Replication & Setup Guide

This guide provides step-by-step instructions to replicate and host this project from scratch using **Supabase** (Database, Auth, Storage) and **Cloudflare** (Domain management, hosting, Pages).

---

## Prerequisites

Before starting, make sure you have:
* A **GitHub** account (to host your repository).
* **Node.js 18+** installed locally.
* A **Supabase** account.
* A **Cloudflare** account with a custom domain name.
* An **SMTP Email Service Provider** (e.g., Resend, SendGrid, Mailgun, or Gmail SMTP) to configure in Supabase.

---

## Step 1: Clone the Codebase & Install Dependencies

1. Clone or copy this repository to your local machine.
2. Navigate into the directory and install Node dependencies:
   ```bash
   npm install
   ```

---

## Step 2: Supabase Project Setup

### 1. Create a Project
1. Log in to the [Supabase Dashboard](https://database.new).
2. Click **New Project** and select/create an organization.
3. Fill in the Project Name, database password, and region.
4. Click **Create new project** and wait for provisioning to complete.

### 2. Set Up Database Schema & Policies
1. In the left-hand sidebar of your Supabase dashboard, click on **SQL Editor**.
2. Click **New query**.
3. Open the file [init.sql](../init.sql) in this repository, copy its entire contents, and paste it into the SQL editor.
4. Click **Run**.
   > [!NOTE]
   > This script creates the `admins`, `landlords`, and `reviews` tables, configures their check constraints and relationships, enables Row Level Security (RLS) policies, sets up the `verification-files` storage bucket, inserts the initial seed data, and hooks up performance indexes.

### 3. Create a Local Admin Account
To manage, approve, or reject landlords and verify student reviews, you need to add your email address as an admin:
1. Go to the **Table Editor** in Supabase and select the `admins` table.
2. Click **Insert row**.
3. Enter your email address in the `email` column and click **Save**.

---

## Step 3: Supabase Authentication Config

Since the app uses a custom UI for registration, email verification, and password resets, you must configure Supabase Auth to route confirmation links properly.

### 1. Configure Site URL & Redirects
1. Go to **Project Settings** > **Auth** > **URL Configuration**.
2. Set the **Site URL** to your local/production app URL (e.g., `http://localhost:3000` for development, or your custom Cloudflare domain like `https://rateyinzlandlord.com` for production).
3. In **Redirect URLs**, add:
   * `http://localhost:3000/**` (for local development redirects)
   * `https://your-cloudflare-subdomain.pages.dev/**` (or your custom domain)

### 2. Customize Auth Email Templates
You must update the links inside the email templates to point to the React app's verification routes:

1. Under **Auth** > **Email Templates**:
2. **Confirm signup** template:
   * Change the message body link to point to:
     ```html
     {{ .SiteURL }}/verify-email?token_hash={{ .TokenHash }}&type=signup
     ```
3. **Reset password** template:
   * Change the message body link to point to:
     ```html
     {{ .SiteURL }}/reset-password?token_hash={{ .TokenHash }}&type=recovery
     ```

---

## Step 4: Configure Email SMTP Provider

To ensure verification and password reset emails are delivered reliably:
1. Obtain SMTP credentials from your email provider (e.g., Resend, SendGrid, Mailgun).
2. In Supabase, go to **Project Settings** > **Auth** > **SMTP Settings**.
3. Toggle **Enable Custom SMTP** to `ON`.
4. Enter your provider's Sender Email, Host, Port, Username, and Password.
5. Save your settings.

---

## Step 5: Configure Storage Bucket

The SQL script `init.sql` automatically registers the `verification-files` bucket, but if you need to create it manually:
1. In Supabase, go to **Storage** > **Buckets**.
2. Click **New Bucket**.
3. Name it `verification-files`.
4. Make sure **Public bucket** is toggled **OFF** (it must remain private for student verification privacy).
5. The Row Level Security (RLS) policies configured in `init.sql` will automatically secure this bucket, allowing only authenticated users to upload and only admins to read and delete.

---

## Step 6: Local Environment Configuration

1. Create a `.env.local` file in the root of your project:
   ```bash
   cp .env.local.example .env.local
   ```
2. Open `.env.local` and paste your Supabase keys (found in Supabase under **Project Settings** > **API**):
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
3. Run the development server locally:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to view the app. If the env keys are correctly read, the yellow warning banner indicating "Demo mode" will be hidden.

---

## Step 7: Host the Site on Cloudflare Pages

Cloudflare Pages is the recommended hosting service because of its speed, security, and global CDN.

### 1. Create a New Cloudflare Pages App
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com).
2. Go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your GitHub repository.
4. Configure Build settings:
   * **Framework preset**: `Vite` (or `None`)
   * **Build command**: `npm run build`
   * **Build output directory**: `dist`
5. Click **Save and Deploy**.

### 2. Add Environment Variables in Cloudflare Pages
1. Go to your Pages project in Cloudflare > **Settings** > **Environment variables**.
2. Add your production Supabase keys (under **Production** and **Preview**):
   * `VITE_SUPABASE_URL` = `https://your-project-id.supabase.co`
   * `VITE_SUPABASE_ANON_KEY` = `your-anon-public-key`
3. Redeploy the page or push a commit to trigger a new build.

### 3. SPA Routing Configuration
Because this app is a Single Page Application (SPA) using React Router, any direct visits to pages other than the home page (e.g. `/admin`, `/search`) will return a 404 error from Cloudflare unless redirects are configured.
* We have pre-configured a `public/_redirects` file with the rule:
  ```text
  /* /index.html 200
  ```
  This is automatically copied to the `dist/` directory during build and tells Cloudflare to route all paths to `index.html`, allowing React Router to handle client-side routing properly.

---

## Step 8: Cloudflare Domain Setup

1. In Cloudflare Pages, go to the **Custom domains** tab.
2. Click **Set up a custom domain**.
3. Type your custom domain name (e.g., `rateyinzlandlord.com`).
4. Cloudflare will ask to update your DNS records. Accept it. Cloudflare automatically provisions a free SSL certificate.
5. Make sure the Site URL in Supabase Auth reflects this custom domain.
