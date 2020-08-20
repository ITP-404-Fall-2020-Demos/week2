const memberTemplate = Handlebars.registerPartial(
  "member",
  $("#member-template").html()
);

const membersTemplate = Handlebars.compile($("#members-template").html());

$("#results").html("Loading...");

$.ajax({
  type: "GET",
  url: "https://api.github.com/orgs/emberjs/members",
})
  .then((members) => {
    const repoPromises = [];

    members.forEach((member) => {
      const promise = fetchRepos(member.repos_url);
      repoPromises.push(promise);
    });

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
  });

function fetchRepos(url) {
  return $.ajax({
    type: "GET",
    url,
  });
}
