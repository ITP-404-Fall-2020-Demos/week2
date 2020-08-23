const dataStore = {
  members: {},
  favoriteMembers: [],
  addMembers(members) {
    members.forEach((member) => {
      this.members[member.id] = member;
    });
  }
};

const memberTemplate = Handlebars.registerPartial(
  "member",
  $("#member-template").html()
);

const membersTemplate = Handlebars.compile($("#members-template").html());

// Grab a personal access token here: https://github.com/settings/tokens
const headers = {
  Authorization: "token f13b126cb2fea57754958ffc1ed1f00931acce2c",
};

$("#results").html("Loading...");

$.ajax({
  headers,
  type: "GET",
  url: "https://api.github.com/orgs/emberjs/members"
})
  .then((members) => {
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
    dataStore.addMembers(members);
    const html = membersTemplate({ members });
    $("#results").html(html);
  });

function fetchRepos(url) {
  return $.ajax({
    type: "GET",
    url,
    headers
  });
}

const favoriteMembersTemplate = Handlebars.compile($("#favorite-members-template").html());

function renderFavoriteMembers() {
  const favoriteMembersHtml = favoriteMembersTemplate({
    members: dataStore.favoriteMembers
  });

  $('#favorite-members').html(favoriteMembersHtml);
}

renderFavoriteMembers();

// $('.js-favorite-member').on('click', function () {
//   console.log($(this).data('id'))
// });

// Event Delegation
$('#results').on('click', '.js-favorite-member', function () {
  const id = $(this).data('id');
  const member = dataStore.members[id];

  dataStore.favoriteMembers.push(member);
  renderFavoriteMembers();
});