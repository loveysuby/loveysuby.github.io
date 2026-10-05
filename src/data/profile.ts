/**
 * Optional sections of the home page. A section is rendered only when its list is not empty,
 * so adding an entry here is all that is needed to show it.
 */

export const education: { heading: string; subheading: string; date: string; href?: string }[] = [
  // { heading: 'University name', subheading: 'B.S. in Computer Science', date: 'Mar 2017 - Feb 2023' }
]

export const certifications: { heading: string; subheading: string; date: string; href?: string }[] = [
  // { heading: 'Certificate name', subheading: 'Issuer', date: 'Jul 2024', href: 'https://...' }
]

export const websites: { heading: string; subheading: string; href: string }[] = [
  // { heading: 'Project name', subheading: 'One-line description', href: 'https://...' }
]

export const skills: { title: string; items: string[] }[] = [
  // { title: 'Languages', items: ['Python', 'Kotlin'] }
]
