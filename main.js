const memberTemplate = Handlebars.compile($("#member-template").html());
const membersTemplate = Handlebars.compile($("#members-template").html(), {
  strict: true,
});

const html = membersTemplate({
  members: [
    {
      login: "abuiles",
      avatar_url: "https://avatars0.githubusercontent.com/u/21772?v=4",
    },
    {
      login: "acorncom",
      avatar_url: "https://avatars1.githubusercontent.com/u/802505?v=4",
    },
  ],
});

$("#results").html(html);
