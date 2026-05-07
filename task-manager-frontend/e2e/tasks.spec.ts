import { test, expect } from "@playwright/test";

test.describe("Task Manager", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Task Manager" })
    ).toBeVisible();
  });

  test("page loads with title and task list", async ({ page }) => {
    await expect(page.getByPlaceholder("Task title")).toBeVisible();
    await expect(page.getByPlaceholder("Search tasks...")).toBeVisible();
    await expect(page.getByRole("button", { name: "All" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Pending" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Completed" })
    ).toBeVisible();
  });

  test("create a task and verify it appears in the list", async ({ page }) => {
    const taskTitle = `Test task ${Date.now()}`;
    const taskDescription = `Description ${Date.now()}`;

    await page.getByPlaceholder("Task title").fill(taskTitle);
    await page
      .getByPlaceholder("Description (optional)")
      .fill(taskDescription);
    await page.getByRole("button", { name: "Add Task" }).click();

    const taskCard = page
      .locator("[data-slot='card']")
      .filter({ hasText: taskTitle });
    await expect(taskCard).toBeVisible({ timeout: 5000 });
    await expect(taskCard.getByText(taskDescription)).toBeVisible();
  });

  test("create a task and mark it as completed", async ({ page }) => {
    const taskTitle = `Complete me ${Date.now()}`;

    await page.getByPlaceholder("Task title").fill(taskTitle);
    await page.getByRole("button", { name: "Add Task" }).click();
    await expect(page.getByText(taskTitle)).toBeVisible({ timeout: 5000 });

    const taskCard = page
      .locator("[data-slot='card']")
      .filter({ hasText: taskTitle });
    await taskCard
      .getByRole("button", { name: /^Complete$/ })
      .click();

    await expect(taskCard.getByText("completed")).toBeVisible({ timeout: 5000 });
  });

  test("filter tasks by status", async ({ page }) => {
    const pendingTitle = `Pending ${Date.now()}`;
    const completedTitle = `Will complete ${Date.now()}`;

    await page.getByPlaceholder("Task title").fill(pendingTitle);
    await page.getByRole("button", { name: "Add Task" }).click();
    await expect(page.getByText(pendingTitle)).toBeVisible({ timeout: 5000 });

    await page.getByPlaceholder("Task title").fill(completedTitle);
    await page.getByRole("button", { name: "Add Task" }).click();
    await expect(page.getByText(completedTitle)).toBeVisible({ timeout: 5000 });

    const completedCard = page
      .locator("[data-slot='card']")
      .filter({ hasText: completedTitle });
    await completedCard
      .getByRole("button", { name: /^Complete$/ })
      .click();
    await expect(completedCard.getByText("completed")).toBeVisible({
      timeout: 5000
    });

    await page.getByRole("button", { name: "Pending" }).click();
    await expect(page.getByText(pendingTitle)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(completedTitle)).not.toBeVisible();

    await page.getByRole("button", { name: "Completed" }).click();
    await expect(page.getByText(completedTitle)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(pendingTitle)).not.toBeVisible();

    await page.getByRole("button", { name: "All" }).click();
    await expect(page.getByText(pendingTitle)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(completedTitle)).toBeVisible();
  });

  test("search tasks by title", async ({ page }) => {
    const uniqueWord = `unicorn${Date.now()}`;
    const searchableTitle = `Find the ${uniqueWord}`;
    const otherTitle = `Other task ${Date.now()}`;

    await page.getByPlaceholder("Task title").fill(searchableTitle);
    await page.getByRole("button", { name: "Add Task" }).click();
    await expect(page.getByText(searchableTitle)).toBeVisible({ timeout: 5000 });

    await page.getByPlaceholder("Task title").fill(otherTitle);
    await page.getByRole("button", { name: "Add Task" }).click();
    await expect(page.getByText(otherTitle)).toBeVisible({ timeout: 5000 });

    await page.getByPlaceholder("Search tasks...").fill(uniqueWord);
    await expect(page.getByText(searchableTitle)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(otherTitle)).not.toBeVisible();

    await page.getByPlaceholder("Search tasks...").clear();
    await expect(page.getByText(otherTitle)).toBeVisible({ timeout: 5000 });
  });

  test("form clears after successful creation", async ({ page }) => {
    const taskTitle = `Clear form ${Date.now()}`;

    await page.getByPlaceholder("Task title").fill(taskTitle);
    await page
      .getByPlaceholder("Description (optional)")
      .fill("Should clear");
    await page.getByRole("button", { name: "Add Task" }).click();

    await expect(page.getByText(taskTitle)).toBeVisible({ timeout: 5000 });
    await expect(page.getByPlaceholder("Task title")).toHaveValue("");
    await expect(
      page.getByPlaceholder("Description (optional)")
    ).toHaveValue("");
  });

  test("success toast appears after creating a task", async ({ page }) => {
    const taskTitle = `Toast test ${Date.now()}`;

    await page.getByPlaceholder("Task title").fill(taskTitle);
    await page.getByRole("button", { name: "Add Task" }).click();

    await expect(page.getByText("Task created")).toBeVisible({ timeout: 5000 });
  });

  test("search by description", async ({ page }) => {
    const uniqueDesc = `descmatch${Date.now()}`;
    const taskTitle = `Desc search ${Date.now()}`;

    await page.getByPlaceholder("Task title").fill(taskTitle);
    await page
      .getByPlaceholder("Description (optional)")
      .fill(uniqueDesc);
    await page.getByRole("button", { name: "Add Task" }).click();
    await expect(page.getByText(taskTitle)).toBeVisible({ timeout: 5000 });

    await page.getByPlaceholder("Search tasks...").fill(uniqueDesc);
    await expect(page.getByText(taskTitle)).toBeVisible({ timeout: 5000 });
  });

  test("pagination controls appear and work", async ({ page }) => {
    const prefix = `pagtest${Date.now()}`;

    for (let i = 0; i < 12; i++) {
      await page.getByPlaceholder("Task title").fill(`${prefix} task ${i}`);
      await page.getByRole("button", { name: "Add Task" }).click();
      await expect(
        page.getByText(`${prefix} task ${i}`).first()
      ).toBeVisible({ timeout: 5000 });
    }

    await page.getByPlaceholder("Search tasks...").fill(prefix);
    await expect(page.getByText("Page 1 of 2")).toBeVisible({ timeout: 5000 });

    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByText("Page 2 of 2")).toBeVisible({ timeout: 5000 });

    await page.getByRole("button", { name: "Previous" }).click();
    await expect(page.getByText("Page 1 of 2")).toBeVisible({ timeout: 5000 });
  });

  test("undo a completed task back to pending", async ({ page }) => {
    const taskTitle = `Undo me ${Date.now()}`;

    await page.getByPlaceholder("Task title").fill(taskTitle);
    await page.getByRole("button", { name: "Add Task" }).click();
    await expect(page.getByText(taskTitle)).toBeVisible({ timeout: 5000 });

    const taskCard = page
      .locator("[data-slot='card']")
      .filter({ hasText: taskTitle });

    await taskCard.getByRole("button", { name: /^Complete$/ }).click();
    await expect(taskCard.getByText("completed")).toBeVisible({ timeout: 5000 });

    await taskCard.getByRole("button", { name: "Undo" }).click();
    await expect(taskCard.getByText("pending")).toBeVisible({ timeout: 5000 });
    await expect(taskCard.getByRole("button", { name: /^Complete$/ })).toBeVisible();
  });

  test("delete a pending task", async ({ page }) => {
    const taskTitle = `Delete me ${Date.now()}`;

    await page.getByPlaceholder("Task title").fill(taskTitle);
    await page.getByRole("button", { name: "Add Task" }).click();
    await expect(page.getByText(taskTitle)).toBeVisible({ timeout: 5000 });

    const taskCard = page
      .locator("[data-slot='card']")
      .filter({ hasText: taskTitle });

    await taskCard.getByRole("button", { name: "Delete" }).click();
    await expect(page.getByText(taskTitle)).not.toBeVisible();
  });

  test("delete a completed task", async ({ page }) => {
    const taskTitle = `Delete completed ${Date.now()}`;

    await page.getByPlaceholder("Task title").fill(taskTitle);
    await page.getByRole("button", { name: "Add Task" }).click();
    await expect(page.getByText(taskTitle)).toBeVisible({ timeout: 5000 });

    const taskCard = page
      .locator("[data-slot='card']")
      .filter({ hasText: taskTitle });

    await taskCard.getByRole("button", { name: /^Complete$/ }).click();
    await expect(taskCard.getByText("completed")).toBeVisible({ timeout: 5000 });

    await taskCard.getByRole("button", { name: "Delete" }).click();
    await expect(page.getByText(taskTitle)).not.toBeVisible();
  });

  test("deleted task does not appear in any filter", async ({ page }) => {
    const taskTitle = `Ghost task ${Date.now()}`;

    await page.getByPlaceholder("Task title").fill(taskTitle);
    await page.getByRole("button", { name: "Add Task" }).click();
    await expect(page.getByText(taskTitle)).toBeVisible({ timeout: 5000 });

    const taskCard = page
      .locator("[data-slot='card']")
      .filter({ hasText: taskTitle });
    await taskCard.getByRole("button", { name: "Delete" }).click();
    await expect(page.getByText(taskTitle)).not.toBeVisible();

    await page.getByRole("button", { name: "Pending" }).click();
    await expect(page.getByText(taskTitle)).not.toBeVisible();

    await page.getByRole("button", { name: "Completed" }).click();
    await expect(page.getByText(taskTitle)).not.toBeVisible();

    await page.getByRole("button", { name: "All" }).click();
    await expect(page.getByText(taskTitle)).not.toBeVisible();
  });
});
