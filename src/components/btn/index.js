import Link from "./components/Link.js";

const app = document.getElementById("app");

const link = new Link({
  href: "#",
  id: "renderChatsBtn",
  className: "btn",
  events: {
    click: (e) => {
      e.preventDefault();
      console.log("Clicked");
    },
  },
  child: "Войти",
});

app.innerHTML = "";
app.appendChild(link.getContent());
