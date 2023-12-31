import Link from "next/link";

export default function Header({ currentUser }) {
  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
    currentUser && { label: "Sell Tickets", href: "/tickets/new" },
    currentUser && { label: "My orders", href: "/orders" },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => (
      <li className="nav-item " key={href}>
        <Link className="nav-link" href={href}>
          {label}
        </Link>
      </li>
    ));

  return (
    <nav className="navbar navbar-light bg-light p-2">
      <Link className="navbar-brand" href="/">
        GitTix
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
}
