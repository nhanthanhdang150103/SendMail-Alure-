export const ProjectSelectors = {
  // Menu
  projectMenuLink: 'a[href*="projects-list"]',

  // Add Project
  addNewButton: 'a[href="#add_form"]:has(svg.feather-plus)',

  // Form Fields
  titleInput: 'input[name="title"]',
  clientSelect: 'span[id*="select2-client_id-container"]',
  clientOptionHighlighted: 'li.select2-results__option.select2-results__option--highlighted',
  hoursInput: 'input[name="budget_hours"]',
  prioritySelect: 'span[title="Highest"]',
  startDateInput: 'input[placeholder="Start Date"]',
  // startDateOkButton: 'div.dtp.animated.fadeIn:not(.hidden) div.dtp-buttons > button.dtp-btn-ok',
  endDateInput: 'input[placeholder="End Date"]',
  // endDateOkButton: 'div.dtp.hidden.animated.fadeIn div.dtp-buttons > button.dtp-btn-ok',
  summaryTextarea: 'textarea[placeholder="Summary"]',
  teamSelect: 'ul.select2-selection__rendered',
  teamOption: '(//li[contains(@class, "select2-results__option") and normalize-space(.)="Admin Example"])',

  // Save Button
  saveButton: '//button[.//span[contains(normalize-space(), "Save")]]',

  // Messages
  successMessage: '.toast-message',
  titleErrorMessage: '.toast-message'
};
