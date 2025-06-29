import { test, expect } from "@playwright/test";

test.describe("Lens Magnifier Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000/dashboard/LensMagnifier"); 
    });

    test("should render the header and description", async ({ page }) => {
        await expect(
            page.getByRole("heading", { name: "Lens Magnifier Cursor" })
        ).toBeVisible();
        await expect(
            page.locator(
                "text=Hover on the image to magnify that part using a lens effect."
            )
        ).toBeVisible();
    });

    // test("should show magnifier lens on hover", async ({ page }) => {
    //     const image = page.locator('img[alt="Zoomable"]');
    //     await expect(image).toBeVisible();

    //     // Hover on image
    //     await image.hover();

    //     // Wait for lens to appear
    //     const lens = page.locator("div").filter({
    //         has: page.locator("img[alt='Zoomable']"),
    //     });
    //     await expect(lens).toBeVisible();
    // });

    test("should switch to Component tab and show code", async ({ page }) => {
        await page.click('button:text("Component")');
        await expect(
            page.locator("text=LensMagnifier Component")
        ).toBeVisible();
        await expect(page.locator("code")).toContainText("useRef");
    });

    test("should switch to Usage tab and show code", async ({ page }) => {
        await page.click('button:text("Usage")');
        await expect(page.locator("text=Usage Example")).toBeVisible();
        await expect(page.locator("code")).toContainText("<LensMagnifier");
    });

    test("should switch to Props tab and display props", async ({ page }) => {
        await page.click('button:text("Props")');
        await expect(page.locator("text=Component Props")).toBeVisible();
        await expect(page.locator("code")).toContainText("zoom");
    });

    test("should switch to Contribute tab and show links", async ({ page }) => {
        await page.click('button:text("Contribute")');
        await expect(
            page.locator("text=Help improve this component!")
        ).toBeVisible();
        await expect(page.locator("text=Report an Issue")).toBeVisible();
        await expect(page.locator("text=Request a Feature")).toBeVisible();
    });
});
