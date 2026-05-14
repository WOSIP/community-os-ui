# Plan: Agent Profile Enhancement

## 1. Backend Updates (Supabase)
- **Database Migration**: 
    - Add `id_picture_url` column to `public.profiles`.
    - Add `id_type` column (TEXT) to `public.profiles`.
    - Create storage buckets: `agent-profiles` and `agent-documents` with public access policies.
- **Edge Function (`supabase/functions/manage-admins/index.ts`)**: 
    - Update to handle `id_picture_url` and `id_type` in `create` and `update` actions.

## 2. Frontend Updates (`src/pages/Dashboard.tsx`)
- **Type Definitions**: Update `Agent` interface to include `id_picture_url` and `id_type`.
- **State Management**: 
    - Update `agentForm` to include `id_type` and handle file states for uploads.
- **UI Components**:
    - Replace the Profile Picture URL input with a file upload component.
    - In the "Documents d'identité" section:
        - Add a selector for "Type d'ID" (Passeport / CNI).
        - Add a file upload component for the ID Picture.
        - Remove manual text inputs for Passport/National ID numbers.
- **File Upload Logic**:
    - Implement a utility to upload files to Supabase Storage before calling the `manage-admins` function.
    - Ensure unique file names (e.g., using timestamp + original name).

## 3. Validation
- Verify agent creation with images.
- Verify agent update with images.
- Verify that ID numbers are no longer required/present.
