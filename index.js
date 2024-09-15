import fetch from "node-fetch";

// fetch useractivity from github users API
async function getUserActivity(username) {
  const url = `https://api.github.com/users/${username}/events`;
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "node.js",
      },
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();

    return json;
  } catch (error) {
    console.log(error);
  }
}

// display user activity
function showActivity(events) {
  if (events.length === 0) {
    console.log("No Recent Activity Found!");
    return;
  }

  events.forEach((event) => {
    let action;
    switch (event.type) {
      case "PushEvent":
        const commitCount = event.payload.commits.length;
        action = `pushed ${commitCount} commit(s) to ${event.repo.name}`;
      case "IssuesEvent":
        action = `Opened a new issue in ${event.repo.name}`;
        break;
      case "WatchEvent":
        action = `Starred ${event.repo.name}`;
        break;
      case "ForkEvent":
        action = `Forked ${event.repo.name}`;
        break;
      case "CreateEvent":
        action = `Created ${event.payload.ref_type} in ${event.repo.name}`;
        break;
      default:
        action = `${event.type.replace("Event", "")} in ${event.repo.name}`;
        break;
    }

    console.log(`- ${action}`);
  });
}

// Command-line input handling
const command = process.argv[2];

if (!command) {
  console.log("Please provide a valid github username");
  process.exit(1);
}

getUserActivity(command)
  .then((events) => {
    showActivity(events);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
