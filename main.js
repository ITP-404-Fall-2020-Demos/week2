const memberTemplate = Handlebars.compile($("#member-template").html());

const html = memberTemplate({
  login: "abuiles",
  // login: "<script>alert('hi')</script>",
  avatar_url: "https://avatars0.githubusercontent.com/u/21772?v=4",
});

$("#results").html(html);
