const memberTemplate = Handlebars.registerPartial(
  "member",
  $("#member-template").html()
);

const membersTemplate = Handlebars.compile($("#members-template").html());

$("#results").html("Loading...");

// Grab a personal access token here: https://github.com/settings/tokens
const headers = {
  Authorization: "token PERSONAL_ACCESS_TOKEN_HERE",
};

$.ajax({
  type: "GET",
  url: "https://api.github.com/orgs/emberjs/members",
  headers,
})
  .then((members) => {
    members = members.slice(0, 3);

    const repoPromises = members.map((member) => fetchRepos(member.repos_url));

    return new Promise((resolve) => {
      Promise.all(repoPromises).then((repos) => {
        members.forEach((member, i) => {
          member.repos = repos[i];
        });

        resolve(members);
      });
    });
  })
  .then((members) => {
    const html = membersTemplate({ members });
    $("#results").html(html);
  })
  .catch(() => {
    $("#results").html("There was an error.");
  });

function fetchRepos(url) {
  return $.ajax({
    type: "GET",
    url,
    headers,
  });
}
