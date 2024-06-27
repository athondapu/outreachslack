const getOpenTaskFilter = () => {
  return "filter[state]=incomplete";
};

const getClosedTaskFilter = () => {
  return "filter[state]=complete";
};

const getPendingTaskFilter = () => {
  return "filter[state]=pending";
};

const getSkippedTaskFilter = () => {
  return "filter[state]=skipped";
};

// TODO fix the date filter/format here
const getDueAtFilter = (date) => {
  return `filter[due_at]=${date}`;
};

const getOwnerIdFilter = (owner_id) => {
  return `filter[owner][id]=${owner_id}`;
};

const pageLimit = (limit) => {
  return `page[limit]=${limit}`;
};

const getTaskURL = () => {
  return 'https://api.outreach-staging.com/api/v2/tasks';
}

module.exports = {
  getOpenTaskFilter,
  getClosedTaskFilter,
  getPendingTaskFilter,
  getSkippedTaskFilter,
  getDueAtFilter,
  getOwnerIdFilter,
  getTaskURL,
  pageLimit
};
