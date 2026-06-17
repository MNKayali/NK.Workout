export default function Card({ children, className = '', as: Tag = 'div', ...rest }) {
  return (
    <Tag
      className={`bg-surface rounded-[var(--radius-card)] shadow-[var(--shadow-card)] ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
