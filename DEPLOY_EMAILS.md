# How to Deploy the Welcome Email Function

You have two options to deploy the `send-welcome-email` function: using the Supabase CLI (recommended) or the Supabase Dashboard.

## Prerequisites
- A **Supabase Project** created at [supabase.com](https://supabase.com)
- A **Resend API Key** from [resend.com](https://resend.com) (for sending emails)

---

## Option 1: Supabase CLI (Recommended)

1.  **Login to Supabase**
    ```powershell
    npx supabase login
    ```

2.  **Link your project** (Find your Reference ID in Project Settings > General)
    ```powershell
    npx supabase link --project-ref nifrcrptepslhxdcapun
    ```

3.  **Set your Resend API Key**
    ```powershell
    npx supabase secrets set RESEND_API_KEY=re_TGUGUpqx_9VPFZof3781bTFdY1NsPQeSw
    ```

4.  **Deploy the function**
    ```powershell
    npx supabase functions deploy send-welcome-email --no-verify-jwt
    ```

    > **Note for Resend Free Tier**: When using `onboarding@resend.dev`, you can only send emails to the email address you verified on Resend. Make sure your test user matches your verified email.

---

## Option 2: Supabase Dashboard (Manual)

1.  Go to your **Supabase Dashboard** > **Edge Functions**.
2.  Click **"Create a new Function"**.
3.  Name it: `send-welcome-email`.
4.  **Copy the code** from your local file:  
    `e:\ShieldX\supabase\functions\send-welcome-email\index.ts`
5.  **Paste it** into the Dashboard editor.
6.  Save/Deploy.
7.  Go to **Functional Settings** (or "Secrets" in the sidebar) and add a new secret:
    - Name: `RESEND_API_KEY`
    - Value: `your-resend-api-key`

## Verification
Once deployed, the `InitializeIdentityPage.jsx` in your app will automatically call this function URL when a user creates their identity.
