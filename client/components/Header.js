import Link from "next/link";

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: "sigin in", href: "/auth/signin" },
    !currentUser && { label: "sign up", href: "/auth/signup" },
    currentUser && { label: "sign out", href: "/auth/signout" },
    currentUser && { label: 'Sell tickets', href: '/tickets/new'},
    currentUser && { label: 'My orders', href:'/orders'}
  ]
    .filter((link) => link)
    .map(({ label, href }) => {
      return (
        <li className="nav-item" key={href}>
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex aligh-items-center">{links}</ul>
      </div>
    </nav>
  );
};

export default Header;
