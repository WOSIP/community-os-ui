# Implementation Plan - Candidate Search and Management

This plan outlines the steps to implement search functionality for candidate files and allow admins to update their status and information.

## 1. Database Schema Update
- Add missing fields to `applications` table to match the application form.
- Add `candidate_id` (e.g., CAND-XXXX) to the `applications` table with an automatic trigger.
- Update `application_status` enum to include 'rejected', 'attributed_exclusive', 'attributed_non_exclusive', and 'disabled'.

## 2. Supabase Integration (`src/lib/supabase.ts`)
- Implement `submitApplication` function to save form data and handle CV upload.
- Implement `searchApplications` function to search by ID, email, name, or business name.
- Implement `updateApplication` function for status and information updates.

## 3. Application Form Update (`src/pages/Application.tsx`)
- Connect the form to Supabase.
- Handle file upload for the CV.
- Generate a success message with the new `candidate_id`.

## 4. Dashboard Enhancements (`src/pages/Dashboard.tsx`)
- Update `Application` interface to include all fields.
- Implement real-time search using the new search function.
- Add a detailed "Application Details/Edit" dialog to allow:
    - Viewing all submitted information.
    - Updating missing or incorrect information.
    - Changing application status with the new options.
- Update the applications table to display `candidate_id` and the new statuses.

## 5. Validation
- Test application submission.
- Test searching by various criteria.
- Test updating status and info as an admin.
