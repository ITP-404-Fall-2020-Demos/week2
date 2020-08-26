const membersTemplate = Handlebars.compile($('#members-template').html());
const favoritesTemplate = Handlebars.compile($('#favorite-members-template').html());

Handlebars.registerPartial('member', $('#member-template').html());

const favoritesHtml = favoritesTemplate();
$('#favorite-members').html(favoritesHtml);

const headers = {
  Authorization: 'token 0c926cdf6008915d4b10d14527697bb47f14e87c'
};

const dataStore = {
  members: {},
  favoriteMembers: [],
  addMembers(members) {
    members.forEach((member) => {
      this.members[member.id] = member;
    });
  }
};

$.ajax({
  headers,
  type: 'GET',
  url: 'https://api.github.com/orgs/emberjs/members'
})
  .then((members) => {
    const repoPromises = members.map((member) => {
      return $.ajax({
        headers,
        type: 'GET',
        url: member.repos_url
      });
    });

    dataStore.addMembers(members);

    return Promise.all(repoPromises).then((repos) => {
      members.forEach((member, i) => {
        member.repos = repos[i];
      });

      return members;
    });
  })
  .then((members) => {
    const html = membersTemplate({ members });
    $('#results').html(html);
  });

$('#results').on('click', '.js-favorite-member', function () {
  const id = $(this).data('id');
  const member = dataStore.members[id];

  dataStore.favoriteMembers.push(member);
  const favoritesHtml = favoritesTemplate({
    members: dataStore.favoriteMembers,
    isFavorite: true
  });

  $('#favorite-members').html(favoritesHtml);
});

$('#favorite-members').on('click', '.js-remove-favorite-member', function () {
  const id = $(this).data('id');

  dataStore.favoriteMembers = dataStore.favoriteMembers.filter((member) => {
    return member.id !== id;
  });

  // const favorites = [];

  // dataStore.favoriteMembers.forEach((member) => {
  //   if (member.id !== id) {
  //     favorites.push(member);
  //   }
  // });

  // dataStore.favoriteMembers = favorites;


  const favoritesHtml = favoritesTemplate({
    members: dataStore.favoriteMembers,
    isFavorite: true
  });

  $('#favorite-members').html(favoritesHtml);
});