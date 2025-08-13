# Accounting Assist — IFRS Virtual Assistant (GitHub Pages, PDF omitted)

This package omits the large IFRS PDF so it downloads easily. Add the PDF in GitHub after upload.

## Deploy (web portal)
1. Create a public repo named **accounting-assist**.
2. Upload all contents of this package (drag-and-drop). Ensure **.github/workflows/deploy.yml** is included.
3. Go to **Settings → Pages**. Set **Source = GitHub Actions**.
4. Wait for the workflow to finish. Site: https://mrleohua.github.io/accounting-assist/

## Add the IFRS PDF
- Upload your file to: `public/ifrs/`
- Rename to: `2025-IFRS-Standards-Combined.pdf`
- Commit. The in-app link will then work at:
  https://mrleohua.github.io/accounting-assist/ifrs/2025-IFRS-Standards-Combined.pdf
