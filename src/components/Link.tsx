import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { navigate } from '../router'

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
}

/** A real <a href> that intercepts plain left-clicks for client-side navigation, so
 * crawlers and middle-click/cmd-click "open in new tab" both keep working. */
export default function Link({ href, onClick, children, ...rest }: Props) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented) return
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(href)
  }

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
