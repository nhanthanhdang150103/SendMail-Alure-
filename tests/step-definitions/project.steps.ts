import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ProjectPage } from '../pom/pages/project.page';
import { page } from '../hooks/hooks';

let projectPage: ProjectPage;

Given('I am logged in and on the project page', async () => {
  projectPage = new ProjectPage(page);
  await projectPage.navigate();
});

When(
  'I add a project with title {string}, client {string}, estimated hours {string}, priority {string}, start date {string}, end date {string}, summary {string}, and team {string}',
  async (title: string, client: string, hours: string, priority: string, startDate: string, endDate: string, summary: string, team: string) => {
    await projectPage.addProject(title, client, hours, priority, startDate, endDate, summary, team);
  }
);

Then('I should see the project {string} message {string}', async (result: string, expectedMessage: string) => {
  let actualMessage: string | null;
  if (result === 'success') {
    actualMessage = await projectPage.getSuccessMessage();
  } else {
    actualMessage = await projectPage.getErrorMessage();
  }
  expect(actualMessage).toContain(expectedMessage);
}); 