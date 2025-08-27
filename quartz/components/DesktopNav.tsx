import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface NavLink {
  text: string
  link: string
}

interface Options {
  links: NavLink[]
}

export default ((opts: Options) => {
  const DesktopNav: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    return (
      <nav class={displayClass}>
        <ul>
          {opts.links.map((link) => (
            <li>
              <a href={link.link}>{link.text}</a>
            </li>
          ))}
        </ul>
      </nav>
    )
  }

  DesktopNav.css = `
  nav {
    margin: 0;
  }

  nav ul {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    list-style: none;
    margin: 0;
    padding: 0;
    align-items: center;
  }

  nav ul li {
    margin: 0;
  }

  nav ul li a {
    text-decoration: none;
    font-weight: 400;
    font-size: 1rem;
    color: var(--darkgray);
    transition: color 0.2s ease;
    position: relative;
  }

  nav ul li a:hover {
    color: var(--tertiary);
  }

  @media (max-width: 800px) {
    nav ul {
      gap: 1rem;
      font-size: 0.9rem;
    }
  }
  `

  return DesktopNav
}) satisfies QuartzComponentConstructor<Options>
