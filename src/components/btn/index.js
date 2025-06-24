import Link from "./Link.js";

export function renderLink(props) {
  const link = new Link({ ...props });

  return link.getContent();
}
