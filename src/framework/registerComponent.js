import Handlebars from "handlebars";

export function registerComponent(name, Component) {
  Handlebars.registerHelper(name, function (...args) {
    const options = args.pop();
    const props = {
      ...options.hash,
      child: typeof options.fn === "function" ? options.fn(this).trim() : "",
    };

    const instance = new Component(props);
    instance.init();

    if (!window._components) {
      window._components = [];
    }

    window._components.push(instance);

    const content = instance.render();
    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-id", instance._id);
    wrapper.appendChild(content.cloneNode(true));

    return new Handlebars.SafeString(wrapper.innerHTML);
  });
}
