const memberTemplate = Handlebars.registerPartial(
  "member",
  $("#member-template").html()
);

const membersTemplate = Handlebars.compile($("#members-template").html());

$("#results").html("Loading...");

$.ajax({
  type: "GET",
  url: "https://api.github.com/orgs/emberjs/members",
}).then((members) => {
  const html = membersTemplate({ members });
  $("#results").html(html);
});
