# UI Preview and Verification

This document outlines the process for verifying UI changes using the built-in preview script.

## Overview

The `npm run preview` command is designed to generate a visual verification of the application's current state. It automates the process of:
1.  Starting the local development server (if not already running).
2.  Launching a headless browser (Playwright).
3.  Navigating to the homepage (or other specified routes).
4.  Capturing a full-page screenshot.
5.  Saving the screenshot to `public/previews/`.

## Usage

To generate a preview:

```bash
npm run preview
```

Upon successful execution, the script will output the path to the generated screenshot, e.g.:

```
Preview saved to: public/previews/preview_2023-10-27T10-00-00-000Z.png
```

## Purpose

This tool ensures that all UI changes are visually verified before submission. It provides a "demo" or "preview" capability by generating tangible artifacts (screenshots) that prove the UI renders correctly.

## Configuration

The preview script is located at `scripts/capture_preview.ts`. It uses Playwright for browser automation.
Screenshots are saved in `public/previews/`, which is git-ignored to prevent repository bloat.
